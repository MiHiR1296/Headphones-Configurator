import { Environment, CameraControls, ContactShadows, Float, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import type CameraControlsImpl from 'camera-controls'
import {
  Box3,
  Color,
  Group,
  MathUtils,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
} from 'three'
import {
  bodyOptions,
  cameraViews,
  cushionOptions,
  findHotspot,
  headbandOptions,
  informationView,
  metalOptions,
  mobileInformationView,
  partGroups,
  portOptions,
  type ConfigState,
  type HotspotId,
} from '../config/product'

type ConfiguratorSceneProps = {
  config: ConfigState
  activeHotspot: HotspotId | null
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}

const modelUrl = `${import.meta.env.BASE_URL}assets/models/headphones.glb`
const modelCenter = new Vector3()
type MaterialRole =
  | 'body'
  | 'headband'
  | 'cushion'
  | 'metal'
  | 'buttons'
  | 'ports'
  | 'led'
  | 'decals'
  | 'fixed'
  | 'stitches'

type TintableMaterial = Material & {
  color?: Color
  emissive?: Color
  emissiveIntensity?: number
  envMapIntensity?: number
  metalness?: number
  roughness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  sheen?: number
  sheenRoughness?: number
}

function getRoleTint(role: MaterialRole, config: ConfigState) {
  const body = bodyOptions.find((item) => item.id === config.body) ?? bodyOptions[0]
  const headband = headbandOptions.find((item) => item.id === config.headband) ?? headbandOptions[0]
  const cushion = cushionOptions.find((item) => item.id === config.cushion) ?? cushionOptions[0]
  const metal = metalOptions.find((item) => item.id === config.metal) ?? metalOptions[0]
  const ports = portOptions.find((item) => item.id === config.ports) ?? portOptions[0]

  if (
    role === 'fixed' ||
    role === 'buttons' ||
    role === 'led' ||
    role === 'decals' ||
    (role === 'headband' && headband.source) ||
    (role === 'cushion' && cushion.source) ||
    (role === 'metal' && metal.source) ||
    (role === 'ports' && ports.source) ||
    (role === 'stitches' && headband.source)
  ) {
    return null
  }

  const values: Record<
    MaterialRole,
    {
      color: string
      roughness: number
      metalness: number
      envMapIntensity: number
      emissive?: string
      emissiveIntensity?: number
      clearcoat?: number
      clearcoatRoughness?: number
      sheen?: number
      sheenRoughness?: number
    }
  > = {
    body: {
      color: body.hex,
      roughness: config.body === 'pearl' || config.body === 'ivory' ? 0.46 : 0.38,
      metalness: 0.04,
      envMapIntensity: config.body === 'pearl' ? 1.32 : 1.18,
      clearcoat: config.body === 'pearl' ? 0.34 : 0.22,
      clearcoatRoughness: config.body === 'pearl' ? 0.42 : 0.48,
    },
    headband: {
      color: headband.hex,
      roughness: headband.id === 'stone' ? 0.9 : 0.76,
      metalness: 0,
      envMapIntensity: 0.8,
      sheen: headband.id === 'stone' ? 0.44 : 0.24,
      sheenRoughness: 0.86,
    },
    cushion: {
      color: cushion.hex,
      roughness: config.cushion === 'stone' ? 0.92 : 0.72,
      metalness: 0,
      envMapIntensity: 0.86,
      sheen: config.cushion === 'stone' ? 0.45 : 0.18,
      sheenRoughness: 0.85,
    },
    metal: {
      color: metal.hex,
      roughness: metal.id === 'gunmetal' ? 0.38 : 0.28,
      metalness: 1,
      envMapIntensity: 1.72,
    },
    buttons: {
      color: '#1f2021',
      roughness: 0.74,
      metalness: 0.02,
      envMapIntensity: 0.6,
    },
    ports: {
      color: ports.hex,
      roughness: ports.id === 'black' ? 0.56 : 0.3,
      metalness: 0.88,
      envMapIntensity: 1.45,
    },
    led: {
      color: '#9de7ff',
      roughness: 0.22,
      metalness: 0,
      envMapIntensity: 1,
      emissive: '#80dcff',
      emissiveIntensity: 2.4,
    },
    decals: {
      color: '#151617',
      roughness: 0.5,
      metalness: 0,
      envMapIntensity: 0.4,
    },
    fixed: {
      color: '#ffffff',
      roughness: 0.95,
      metalness: 0,
      envMapIntensity: 1,
    },
    stitches: {
      color: headband.id === 'black' || headband.id === 'moss' ? '#ded8cc' : '#f3eee5',
      roughness: 0.84,
      metalness: 0,
      envMapIntensity: 0.45,
    },
  }

  return values[role]
}

function materialRoleForName(name: string, materialName = ''): MaterialRole {
  if (materialName === 'Right Vibrator' || materialName === 'Left Vibrator') return 'fixed'
  if (materialName.includes('Vibrator')) return 'fixed'
  if (materialName === 'Pitch Black') return 'fixed'
  if (materialName === 'Stainless Steel') return 'ports'
  if (materialName === 'Brushed metal' || materialName === 'Brushed Metal') return 'metal'
  if (materialName === 'Mat Grey Plastic') return 'buttons'
  if (materialName === 'LED Emission') return 'led'
  if (materialName === 'On/Off Text' || materialName === 'Blutooth Icon') return 'decals'
  if (partGroups.headband.includes(name as never)) return 'headband'
  if (partGroups.cushions.includes(name as never)) return 'cushion'
  if (partGroups.metalYokes.includes(name as never)) return 'metal'
  if (partGroups.led.includes(name as never)) return 'led'
  if (partGroups.decals.includes(name as never)) return 'decals'
  if (partGroups.drivers.includes(name as never)) return 'fixed'
  if (partGroups.headbandStitches.includes(name as never)) return 'stitches'
  if (name === 'Usb C port' || name === 'Audio Port') return 'ports'
  if (partGroups.buttonsPorts.includes(name as never)) return 'buttons'
  if (partGroups.outerShell.includes(name as never)) return 'body'
  return 'body'
}

function styleMaterial(original: Material | null | undefined, meshName: string, config: ConfigState) {
  const source =
    original ??
    new MeshPhysicalMaterial({
      color: '#858585',
      roughness: 0.7,
      metalness: 0,
    })
  const material = source.clone() as TintableMaterial
  const role = materialRoleForName(meshName, material.name)
  const tint = getRoleTint(role, config)
  if (!tint) {
    material.needsUpdate = true
    return material
  }

  if (material.color instanceof Color) material.color.set(tint.color)
  if (material.emissive instanceof Color && tint.emissive) material.emissive.set(tint.emissive)
  if ('emissiveIntensity' in material && tint.emissiveIntensity !== undefined) {
    material.emissiveIntensity = tint.emissiveIntensity
  }
  if ('roughness' in material) material.roughness = tint.roughness
  if ('metalness' in material) material.metalness = tint.metalness
  if ('envMapIntensity' in material) material.envMapIntensity = tint.envMapIntensity
  if ('clearcoat' in material && tint.clearcoat !== undefined) material.clearcoat = tint.clearcoat
  if ('clearcoatRoughness' in material && tint.clearcoatRoughness !== undefined) {
    material.clearcoatRoughness = tint.clearcoatRoughness
  }
  if ('sheen' in material && tint.sheen !== undefined) material.sheen = tint.sheen
  if ('sheenRoughness' in material && tint.sheenRoughness !== undefined) {
    material.sheenRoughness = tint.sheenRoughness
  }

  material.needsUpdate = true
  return material
}

function styleMeshMaterial(mesh: Mesh, config: ConfigState) {
  const original = mesh.userData.originalMaterial as Material | Material[] | undefined
  const current = original ?? mesh.material

  if (Array.isArray(current)) {
    mesh.material = current.map((material) => styleMaterial(material, mesh.name, config))
    return
  }

  mesh.material = styleMaterial(current, mesh.name, config)
}

function SceneReady({ onCanvasReady }: { onCanvasReady: (canvas: HTMLCanvasElement) => void }) {
  const { gl } = useThree()

  useEffect(() => {
    onCanvasReady(gl.domElement)
  }, [gl.domElement, onCanvasReady])

  return null
}

function HeadphonesModel({
  config,
  activeHotspot,
}: {
  config: ConfigState
  activeHotspot: HotspotId | null
}) {
  const gltf = useGLTF(modelUrl)
  const rootRef = useRef<Group>(null)

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    const box = new Box3().setFromObject(clone)
    box.getCenter(modelCenter)
    const size = box.getSize(new Vector3()).length()
    const scalar = size > 0 ? 2.45 / size : 1
    clone.scale.setScalar(scalar)
    clone.position.set(
      -modelCenter.x * scalar,
      -modelCenter.y * scalar,
      -modelCenter.z * scalar,
    )
    clone.rotation.set(0, MathUtils.degToRad(-22), 0)
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return
      object.castShadow = true
      object.receiveShadow = true
      object.userData.originalMaterial = Array.isArray(object.material)
        ? object.material.map((material) => material.clone())
        : object.material?.clone()
    })
    return clone
  }, [gltf.scene])

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return
      styleMeshMaterial(object, config)
    })
  }, [config, scene])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    gsap.fromTo(
      root.scale,
      { x: 0.7, y: 0.7, z: 0.7 },
      { x: 1, y: 1, z: 1, duration: 1.3, ease: 'power3.out' },
    )
    gsap.fromTo(root.rotation, { y: -1.05 }, { y: 0, duration: 1.45, ease: 'power3.out' })
    gsap.fromTo(root.position, { y: -0.16 }, { y: 0, duration: 1.1, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (config.mode === 'information' && !activeHotspot) {
      gsap.to(root.rotation, {
        x: 0,
        y: informationView.modelRotation,
        z: 0,
        duration: 0.72,
        ease: 'power3.out',
      })
      return
    }

    if (config.mode === 'customize') {
      gsap.to(root.rotation, { x: 0, z: 0, duration: 0.35, ease: 'power2.out' })
    }
  }, [activeHotspot, config.mode])

  useFrame((_, delta) => {
    const root = rootRef.current
    if (!root) return
    if (config.mode === 'customize') {
      root.rotation.y += delta * 0.045
      return
    }
    if (activeHotspot) root.rotation.y += delta * 0.01
  })

  return (
    <Float
      speed={config.mode === 'customize' ? 1.2 : 0}
      rotationIntensity={config.mode === 'customize' ? 0.05 : 0}
      floatIntensity={config.mode === 'customize' ? 0.08 : 0}
    >
      <group ref={rootRef} position={[0, -0.02, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  )
}

function CameraRig({ config, activeHotspot }: { config: ConfigState; activeHotspot: HotspotId | null }) {
  const controlsRef = useRef<CameraControlsImpl>(null)
  const { size } = useThree()

  useEffect(() => {
    if (config.mode === 'information') {
      const hotspot = findHotspot(activeHotspot)
      const view = hotspot?.camera ?? (size.width < 700 ? mobileInformationView : informationView)
      controlsRef.current?.setLookAt(
        view.position[0],
        view.position[1],
        view.position[2],
        view.target[0],
        view.target[1],
        view.target[2],
        true,
      )
      return
    }

    const view = cameraViews[config.view]
    controlsRef.current?.setLookAt(
      view.position[0],
      view.position[1],
      view.position[2],
      view.target[0],
      view.target[1],
      view.target[2],
      true,
    )
  }, [activeHotspot, config.mode, config.view, size.width])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={0.22}
      maxDistance={5.8}
      dollySpeed={0.45}
      draggingSmoothTime={0.12}
      azimuthRotateSpeed={0.75}
      polarRotateSpeed={0.65}
    />
  )
}

function ProductScene({
  config,
  activeHotspot,
  onCanvasReady,
}: ConfiguratorSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: cameraViews.hero.position, fov: 36, near: 0.01, far: 20 }}
      gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
    >
      <SceneReady onCanvasReady={onCanvasReady} />
      <color attach="background" args={['#efeeeb']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 3]} intensity={2.3} castShadow shadow-mapSize={2048} />
      <spotLight position={[-3, 3.4, 2.8]} intensity={2} angle={0.38} penumbra={0.7} />
      <Environment preset="studio" environmentIntensity={1.05} />
      <Suspense fallback={null}>
        <HeadphonesModel config={config} activeHotspot={activeHotspot} />
        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.24}
          scale={4.6}
          blur={2.6}
          far={3.2}
        />
      </Suspense>
      <CameraRig config={config} activeHotspot={activeHotspot} />
    </Canvas>
  )
}

useGLTF.preload(modelUrl)

export function ConfiguratorScene(props: ConfiguratorSceneProps) {
  return <ProductScene {...props} />
}
