# fe-supervisor (The frontend monitor project)


## Quick Start

Several options to get up and running:

* Clone the repo: `git clone https://github.com/BobbyLH/fe-supervisor`
* Install with [npm](https://www.npmjs.com/package/roarjs): `npm install fe-supervisor`
* Install with [Yarn](https://yarnpkg.com/en/package/roarjs): `yarn add fe-supervisor`


```html
<script src=`${pathTo}/dist/fe-supervisor.min.js` ></script>
<script>
    console.log($sv.getTiming())
</script>
```

```javascript
import sv from 'fe-supervisor'

console.log(sv.getMemory())
```


## API

### Global NameSpace
$sv

### Methods
#### getPerformanceData(config)
Get the all performance data.
```javascript
import sv from 'fe-supervisor'

sv.getPerformanceData().then(data => console.log(data))
```
```typescript
interface config {
  apiRatio?: number;
  sourceRatio?: number;
  apis?: string[] | string;
  sources?: Isources | string[] | string;
}
```

#### getMemory()
Get memory consumption.

#### getTiming()
Get performance timing.

#### getSource(config)
Get source timing.
```javascript
import sv from 'fe-supervisor'

sv.getSource().then(data => console.log(data))
```
```typescript
interface config {
  apiRatio?: number;
  sourceRatio?: number;
  apis?: string[] | string;
  sources?: Isources | string[] | string;
}
```

#### mark(tag)
Marking a tag in the code.

#### getExecTiming()
Get tagged code execution timing.
```javascript
import sv from 'fe-supervisor'

sv.getExecTiming().then(data => console.log(data))
```

#### clearPerformance()
Clear performance data.

#### observeSource(target, callback, sourceType?)
get source timing information by refer dom.
```javascript
import sv from 'fe-supervisor'

const sec = document.querySelect('section')
sv.observeSource(sec, function (source) {
  console.log('source', source)
}, 'img')
```

#### getEnvInfo()
Get browser environment information.

#### getError(errType)
Get errors information.
```typescript
type errType = 'js' | 'api' | 'source'
```

#### setError(error)
Set error.
```typescript
interface error {
  type: ExceptionType;
  sourceType?: string;
  url: string;
  [propName: string]: any;
}
```
#### makeTrackInfo(type, info)
Making a track infomation.

#### observeError(target, callback?, observeDom?)
obersevation appoint target's children error.
```javascript
import sv from 'fe-supervisor'
import React from 'react'



export default class Detail extends React.PureComponent{
  constructor (props) {
    super(props)
    this.pool = React.createRef()
  }
  addImg () {
    // observer DOM
    $sv.observeError(pool, function (errObj) {
      console.log('errObj', errObj)
    })
    // api request
    this.setState({
      Imgs: data
    })
  }

  getError () {
    const errObj = sv.getError('source')
    console.log(errObj)
  }

  render () {
    const { Imgs = null } = this.state
    return (
      <div ref={this.pool}>
        <button onClick={this.addImg.bind(this)}>点击加图</button>
        { Imgs }
        <button onClick={this.getError.bind(this)}>获取错误信息</button>
      </div>
    )
  }
}
```
```typescript
type target = HTMLElement
type observeDom = string | string[]
```


## License

Copyright (c) 2018-2019 Bobby.li

Released under the MIT License