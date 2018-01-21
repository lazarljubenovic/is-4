const fs = require('fs')
const csv = require('csvtojson')
const decisionTree = require('decision-tree')
const shuffleArray = require('shuffle-array')

const dataPath = './iris.data'

const data = []
const targetClass = 'className'
const features = ['sepialLength', 'sepialWidth', 'petalLength', 'petalWidth']

function main() {
  const dataset = shuffleArray(data)
  const sliceAt = Math.round(dataset.length * .7)
  const trainingDataset = dataset.slice(0, sliceAt)
  const testDataset = dataset.slice(sliceAt)

  const dt = new decisionTree(trainingDataset, targetClass, features)
  testDataset.forEach(d => {
    const predicted = dt.predict(d)
    const actual = d['className']
    const correct = predicted == actual
    if (!correct) {
      console.log(`✗ Predicted as ${predicted} but is ${actual}`)
    } else {
      console.log('✓')
    }
  })

  const accuracy = dt.evaluate(testDataset)
  console.log(accuracy)
}

csv({noHeader: true, headers: [...features, targetClass]})
  .fromFile(dataPath)
  .on('json', json => {
    data.push(json)
  })
  .on('end', main)
