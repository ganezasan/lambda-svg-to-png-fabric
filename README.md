# lambda-svg-to-png-fabric

This lambda function create png from svg. using canvas and d3.js.

## Install Serverless

```
npm install -g serverless
```

## Deploy

```
serverless deploy
```
## Run the function

```
serverless invoke -f lambdaSvgToPngFabric -p event.json
```

### API params

```
{
  body : {
    svgString: "this parameter needs encodeURIComponent",
    height: 960,
    width: 960
  }
}
```
