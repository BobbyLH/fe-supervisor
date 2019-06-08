# fe-supervisor (The frontend monitor project)


## Quick Start

Several options to get up and running:

* Clone the repo: `git clone https://github.com/BobbyLH/fe-supervisor`
* Install with [npm](https://www.npmjs.com/package/roarjs): `npm install fe-supervisor`
* Install with [Yarn](https://yarnpkg.com/en/package/roarjs): `yarn add fe-supervisor`


```html
<script src='pathTo/dist/fe-supervisor.min.js' ></script>
<script>
    console.log($sv.getPerformanceData())
</script>
```

```javascript
import sv from 'fe-supervisor'

console.log($sv.getPerformanceData())
```


## API

### Global NameSpace
$sv

### Methods
#### getPerformanceData(config)
Get the all performance data.
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

#### clearPerformance()
Clear performance data.

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

#### new ObserveError(target, observeDom?)
Obersevation appoint target's children error.
```typescript
type target = HTMLElement
type observeDom = string | string[]
```


## License

Copyright (c) 2018-2019 Bobby.li

Released under the MIT License