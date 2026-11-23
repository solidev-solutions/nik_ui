/**
 * A color as a hex value, or nothing for what the browser does not take for a color. A see-through
 * color is the one it makes on the ground; without a ground it counts as solid. A color outside
 * sRGB is the nearest one an sRGB screen has: each channel is cut off at its end.
 */
export function hexOf(color: string, ground?: string) {
  const channels = channelsOf(color)
  const under = ground === undefined ? channels : channelsOf(ground)
  if (!channels || !under) return ''
  const alpha = channels[3]!
  const bytes = channels.slice(0, 3).map((channel, at) => {
    const shown = channel * alpha + under[at]! * (1 - alpha)
    const byte = Math.round(Math.min(Math.max(shown, 0), 1) * 255)
    return byte.toString(16).padStart(2, '0')
  })
  return `#${bytes.join('')}`.toUpperCase()
}

const parsed = new Map<string, number[] | undefined>()

/**
 * Red, green, blue and alpha in sRGB, where a channel below 0 or above 1 lies outside it. A mix
 * of the color with itself is the color in sRGB, whatever notation it was written in.
 */
function channelsOf(color: string) {
  if (parsed.has(color)) return parsed.get(color)
  const probe = document.body.appendChild(document.createElement('span'))
  probe.style.color = `color-mix(in srgb, ${color}, ${color})`
  const found =
    probe.style.color &&
    /srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.e-]+))?/.exec(getComputedStyle(probe).color)
  probe.remove()
  const channels = found ? found.slice(1).map((channel) => Number(channel ?? 1)) : undefined
  parsed.set(color, channels)
  return channels
}
