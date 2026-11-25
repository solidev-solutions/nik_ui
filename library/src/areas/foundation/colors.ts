/**
 * A color as a hex value, or nothing for what the browser does not take for a color. A mix of the
 * color with itself is the color in sRGB, whatever notation it was written in.
 */
export function hexOf(color: string) {
  const probe = document.body.appendChild(document.createElement('span'))
  probe.style.color = `color-mix(in srgb, ${color}, ${color})`
  const channels =
    probe.style.color && /srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)/.exec(getComputedStyle(probe).color)
  probe.remove()
  if (!channels) return ''
  const bytes = channels.slice(1).map((channel) => {
    const byte = Math.round(Math.min(Math.max(Number(channel), 0), 1) * 255)
    return byte.toString(16).padStart(2, '0')
  })
  return `#${bytes.join('')}`.toUpperCase()
}
