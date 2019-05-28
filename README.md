# Code Challenge
_“How much of a given video has this user watched at least once?”_

The `index.html` page within this repository includes a video player and a javascript solution to calculate the unique view time watched of the video.

## Installation
There are zero dependencies, you simply need to clone this repository and serve the files on your localhost to view the demo page.

For example, on OSX simply clone, navigate to `/challenge/` in your terminal window and run `python -m SimpleHTTPServer`. Then navigate to [0.0.0.0:8000/](http://0.0.0.0:8000/)

Alternatively if you are using an OS without Python, you can install node.js and use the _http-server_ package and run it within the directory:
```bash
 npm install http-server -g
 http-server
```
...and then navigate to [localhost:8080](http://localhost:8080/) to view the demo.

## Usage
You will find instructions on the page to help you through the demo.

Note: This demo is very rough around the edges and is only to demonstrate the methodology!


## Validation/testing:
Given more Time, I would have added tests for the following:
- Each fragment should contain both a start AND end time
- Both times should be integers and never less than zero
- The end time should always be > start time
- Neither time should exceed the content length
- With the minimum start time being 0, I would also set a maximum for start/end time, eg. 72000000ms (20 hours)

- As well as the above tests, I would have tested the UVT algorithm with the following arrays of test data:

```javascript
    Expect: [[1000,2000],[13000,16000],[16000,116000]] ToBe: 101000     //simple array
    Expect: [[10000,20000],[1000,2000],[13000,16000]] ToBe: 11000       //unordered array
    Expect: [[0000,000100],[0,100],[0050,0100],[0080,100]] ToBe: 100    //preceding zeros
    Expect: [[123,1123],[123,1123],[1123,2123],[1123,2123]] ToBe: 2000  //duplicate times
````