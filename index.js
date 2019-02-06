const robot = require('robotjs')
const fs = require('fs')
let Jimp = require('jimp')

// These must be correct that capture is working.
// Im using second monitor that has resolution 1680 x 1050 and game is open on chrome browser.
// Also I have bookmars always visible on chrome.
// You can try to set same settings and see if they match
const x = 2630
const y = 922
const width = 125
const height = 35
const offset = 10

// Hashes that should trigger click
const click = [
  '800g0100000',
  '9b0xdAwwc2A',
  '8g000120000',
  '9981dAMyc2A',
  '800g0000000',
  '9b8xdAMwc2A',
  'c00k01000w0',
  '91wA628o9xw',
  'a10w6zg8c0M',
  'a10Q21wM31w',
  '9b8xdAMyc2A'
]

// Used to ignore hashes when debugging noClicks
const noClickHash = [
  '80000000000',
  '82000000000',
  'c20w0000000'
]

// Last slot is used because sometimes the game is so slow in start and script double-clicks
let lastSlot
let lastSlotAmount = 0
let clickAmount = 0
function mouseClick(slot) {
  if (clickAmount > 65 || slot !== lastSlot || lastSlotAmount > 1) {
    console.log('click')
    // Move mouse into slot
    robot.moveMouse(x + (width * slot) + (offset * 2), y + (offset * 2))
    robot.mouseClick()
    // Move mouse away so its not in front when campturing
    robot.moveMouse(1, 1)
    lastSlot = slot
    lastSlotAmount = 0
    clickAmount += 1
  } else {
    // console.log('lastslot', slot)
  }
  lastSlotAmount += 1
}

async function process() {
  let clicked = false
  // Loop every slot throught
  for (let index = 0; index < 4; index++) {
    // Campture slot
    const img = robot.screen.capture(
      x + (width * index) + offset,
      y,
      width - (offset * 2),
      height
    ).image;
    // read image hash
    const image = await Jimp.read({data: img, width: width - (offset * 2), height}); // @todo Could we calculte hash from robot?
    const hash = image.hash()
    if (click.includes(hash)) {
      console.log(hash)
      mouseClick(index)
    }
  }
  // Call itself to continue clicking
  process();
}
process();
