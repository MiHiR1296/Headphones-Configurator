import { Html, Environment, CameraControls, ContactShadows, Float, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import type CameraControlsImpl from 'camera-controls'
import {
  Box3,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Vector3,
} from 'three'
import {
  bodyOptions,
  cameraViews,
  cushionOptions,
  hotspotDefinitions,
  ledOptions,
  metalOptions,
  partGroups,
  type ConfigState,
} from '../config/product'

type ConfiguratorSceneProps = {
  config: ConfigState
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}

const modelUrl = `${import.meta.env.BASE_URL}assets/models/headphones.glb`
const modelCenter = new Vector3()

function createMaterialSet(config: ConfigState) {
  const body = bodyOptions.find((item) => item.id === config.body) ?? bodyOptions[0]
  const cushion = cushionOptions.find((item) => item.id === config.cushion) ?? cushionOptions[0]
  const metal = metalOptions.find((item) => item.id === config.metal) ?? metalOptions[0]
  const led = ledOptions.find((item) => item.id === config.led) ?? ledOptions[0]
  const darkDecal = config.body === 'ivory' || config.cushion === 'stone'

  return {
    body: new MeshPhysicalMaterial({
      color: new Color(body.hex),
      roughness: config.body === 'ivory' ? 0.42 : 0.34,
      metalness: 0.08,
      clearcoat: 0.42,
      clearcoatRoughness: 0.38,
      envMapIntensity: 1.35,
    }),
    cushion: new MeshPhysicalMaterial({
      color: new Color(cushion.hex),
      roughness: config.cushion === 'stone' ? 0.86 : 0.62,
      metalness: 0,
      sheen: 0.35,
      sheenRoughness: 0.75,
      envMapIntensity: 0.8,
    }),
    metal: new MeshPhysicalMaterial({
      color: new Color(metal.hex),
      roughness: config.metal === 'gunmetal' ? 0.34 : 0.22,
      metalness: 1,
      anisotropy: 0.55,
      envMapIntensity: 1.65,
    }),
    buttons: new MeshPhysicalMaterial({
      color: new Color('#232323'),
      roughness: 0.72,
      metalness: 0.02,
      envMapIntensity: 0.65,
    }),
    ports: new MeshPhysicalMaterial({
      color: new Color('#a9aeb2'),
      roughness: 0.28,
      metalness: 0.85,
      envMapIntensity: 1.4,
    }),
    led: new MeshPhysicalMaterial({
      color: new Color(led.hex),
      emissive: new Color(led.hex),
      emissiveIntensity: config.led === 'off' ? 0 : 3.8,
      roughness: 0.18,
      transmission: 0.15,
    }),
    decals: new MeshPhysicalMaterial({
      color: new Color(darkDecal ? '#111214' : '#f6f2ea'),
      roughness: 0.48,
      metalness: 0,
      envMapIntensity: 0.35,
    }),
    drivers: new MeshPhysicalMaterial({
      color: new Color('#121416'),
      roughness: 0.92,
      metalness: 0,
      envMapIntensity: 0.25,
    }),
    stitches: new MeshPhysicalMaterial({
      color: new Color(config.cushion === 'black' ? '#d5d0c7' : '#f0ece4'),
      roughness: 0.82,
      metalness: 0,
      envMapIntensity: 0.45,
    }),
  }
}

function materialRoleForName(name: string) {
  if (partGroups.cushions.includes(name as never)) return 'cushion'
  if (partGroups.metalYokes.includes(name as never)) return 'metal'
  if (partGroups.led.includes(name as never)) return 'led'
  if (partGroups.decals.includes(name as never)) return 'decals'
  if (partGroups.drivers.includes(name as never)) return 'drivers'
  if (name === 'Outer Stiches' || name === 'Inner Stiches') return 'stitches'
  if (name === 'Usb C port' || name === 'Audio Port') return 'ports'
  if (partGroups.buttonsPorts.includes(name as never)) return 'buttons'
  return 'body'
}

function getExplodeOffset(object: Object3D, center: Vector3) {
  const world = new Vector3()
  object.getWorldPosition(world)
  const direction = world.sub(center).normalize()
  if (direction.lengthSq() < 0.01) direction.set(0, 1, 0)

  const name = object.name
  const strength = name.includes('_L') ? 0.095 : name.includes('_R') ? 0.095 : 0.065
  const lift =
    name.includes('Cussions') || name.includes('Leather Frame') || name.includes('Stiches')
      ? 0.045
      : -0.018

  return new Vector3(direction.x * strength, direction.y * strength + lift, direction.z * strength)
}

function SceneReady({ onCanvasReady }: { onCanvasReady: (canvas: HTMLCanvasElement) => void }) {
  const { gl } = useThree()

  useEffect(() => {
    onCanvasReady(gl.domElement)
  }, [gl.domElement, onCanvasReady])

  return null
}

function Hotspot({
  object,
  label,
  fallbackPosition,
  visible,
}: {
  object: Object3D | undefined
  label: string
  fallbackPosition: readonly number[]
  visible: boolean
}) {
  const ref = useRef<Group>(null)
  const position = useMemo(
    () => new Vector3(fallbackPosition[0], fallbackPosition[1], fallbackPosition[2]),
    [fallbackPosition],
  )

  useFrame(() => {
    if (!ref.current) return
    if (object) object.getWorldPosition(position)
    ref.current.position.lerp(position, 0.32)
  })

  if (!visible) return null

  return (
    <group ref={ref}>
      <Html center distanceFactor={0.62}>
        <div className="hotspot-label">
          <span />
          {label}
        </div>
      </Html>
    </group>
  )
}

function HeadphonesModel({ config }: { config: ConfigState }) {
  const gltf = useGLTF(modelUrl)
  const rootRef = useRef<Group>(null)
  const materialSet = useMemo(() => createMaterialSet(config), [config])

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
    return clone
  }, [gltf.scene])

  const meshMap = useMemo(() => {
    const nextMap = new Map<string, Object3D>()
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return
      nextMap.set(object.name, object)
      object.castShadow = true
      object.receiveShadow = true
      object.userData.originalPosition = object.position.clone()
      object.userData.explodedOffset = getExplodeOffset(object, new Vector3())
    })
    return nextMap
  }, [scene])

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const role = materialRoleForName(object.name)
      object.material = materialSet[role]
    })
  }, [materialSet, scene])

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const original = object.userData.originalPosition as Vector3 | undefined
      const exploded = object.userData.explodedOffset as Vector3 | undefined
      if (!original || !exploded) return
      const target = config.mode === 'exploded' ? original.clone().add(exploded) : original
      gsap.to(object.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 0.8,
        ease: 'power3.out',
      })
    })
  }, [config.mode, scene])

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

  useFrame((_, delta) => {
    const root = rootRef.current
    if (!root) return
    root.rotation.y += delta * (config.mode === 'exploded' ? 0.035 : 0.055)
  })

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.08}>
      <group ref={rootRef} position={[0, -0.02, 0]}>
        <primitive object={scene} />
        {hotspotDefinitions.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            object={meshMap.get(hotspot.mesh)}
            label={hotspot.label}
            fallbackPosition={hotspot.position}
            visible={config.hotspots}
          />
        ))}
      </group>
    </Float>
  )
}

function CameraRig({ config }: { config: ConfigState }) {
  const controlsRef = useRef<CameraControlsImpl>(null)

  useEffect(() => {
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
  }, [config.view])

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

function ProductScene({ config, onCanvasReady }: ConfiguratorSceneProps) {
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
        <HeadphonesModel config={config} />
        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.24}
          scale={4.6}
          blur={2.6}
          far={3.2}
        />
      </Suspense>
      <CameraRig config={config} />
    </Canvas>
  )
}

useGLTF.preload(modelUrl)

export function ConfiguratorScene(props: ConfiguratorSceneProps) {
  return <ProductScene {...props} />
}
