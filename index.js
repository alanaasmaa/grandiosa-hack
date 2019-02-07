const Jimp = require('jimp')
const crypto = require('crypto')
const fs = require('fs')
const robot = require('robotjs')

// These must be correct that capture is working.
// Im using second monitor that has resolution 1680 x 1050 and game is open on chrome browser.
// Also I have bookmarks always visible on chrome.
// You can try to set same settings and see if they match
const x = 2628
const y = 889
const width = 125
const height = 135
const offset = 30

// Hashes that should trigger click
const click = [
]


function mouseClick(slot) {
    // Move mouse into slot
    console.log(width * slot)
    robot.moveMouse(x + (width * slot), y)
    // robot.mouseClick()
    // Move mouse away so its not in front when capturing
    // robot.moveMouse(1, 1)
}

// Used for debugging
function screenCaptureToFile(robotScreenPic) {
  return new Promise((resolve, reject) => {
    try {
      const image = new Jimp(robotScreenPic.width, robotScreenPic.height);
      let pos = 0;
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        /* eslint-disable no-plusplus */
        image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
        /* eslint-enable no-plusplus */
      });
      resolve(image);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

async function process() {
  let clicked = false
  // Loop every slot throught
  for (let index = 0; index < 4; index++) {
    // Campture slot
    const capture = robot.screen.capture(
      x + (width * index) + offset,
      y,
      width - (offset * 2),
      height
    )
    // Save image (used to debug)
    // const image = await screenCaptureToFile(capture)
    // image.write(`test-${index}.png`)
    const hash = crypto.createHash('sha1').update(capture.image).digest('base64').substring(0, 5)
    if (click.includes(hash)) {
      mouseClick(index)
      console.log('click', index + 1, hash)
    } else {
      console.log(index + 1, hash)
    }
  }
  // Call itself to continue clicking
  // await process();
}
process()
