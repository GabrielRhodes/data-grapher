import { downloadSvg } from 'svg-crowbar'
import { useState, useEffect } from 'react'
import PieTable from './PieTable'
import ColorModel from './ColorModel'
import ErrorMessage from './ErrorMessage'
import './index.scss'

function PieChart() {
  const [data, setData] = useState(',')
  const [csv, setCsv] = useState(false)
  const [error, setError] = useState(false)
  const [editColors, setEditColors] = useState(false)

  useEffect(() => {
    waitForElm('#data-csv').then(() => getCsv())
  })

  function waitForElm(tag) {
    return new Promise((resolve) => {
      if (document.querySelector(tag)) {
        return true
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(tag)) {
          resolve(document.querySelector(tag))
          observer.disconnect()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }

  function getCsv() {
    let input = document.getElementById('data-csv')
    input.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        var myFile = this.files[0]
        var reader = new FileReader()

        reader.addEventListener('load', function (e) {
          let csvdata = e.target.result
          setData(csvdata)
          createChart(csvdata)
        })

        reader.readAsBinaryString(myFile)
      }
    })
  }

  function updateData(row, cell, val) {
    var cells = data.split('\n').map((line) => line.split(','))
    cells[row][cell] = val
    cells.forEach((cell) => {
      cell.join(',')
    })
    setData(cells.join('\n'))
  }

  function deleteRow(i) {
    var cells = data.split('\n')
    if (cells.length > 1) {
      cells.splice(i, 1)
      setData(cells.join('\n'))
    }
  }

  function createChart(str = data) {
    if (str === '') {
      return
    }
    var values = str.split('\n').map((val) => val.split(','))
    if (values[0].length !== 2) {
      return displayError(
        'Improper Format. Make sure that your .csv file is properly formatted in the form, "field,value\nfield,value...etc.". We require two columns and no more than 16 rows.'
      )
    }
    if (values.length > 16) {
      return displayError('Too Many Fields (Max 16).')
    }
    if (soloPath(values)) {
      return
    }

    drawPaths(values)
    labelPaths(values)
  }

  function drawPaths(values) {
    var nums = values.map((val) => parseFloat(val[1]))
    console.log(nums.indexOf(NaN))
    if (nums.includes(NaN)) {
      return displayError(
        `The value in row ${
          nums.indexOf(NaN) + 1
        } is not a number and no number could be extracted. Please make sure all values are numeric and all rows have a value.`
      )
    }
    if (nums.some((num) => num <= 0)) {
      return displayError(
        'Due to the nature of a pie chart, negative values are not permitted. If you wish to make a transparent field, edit the field color in settings.'
      )
    }
    var total = nums.reduce((sum, a) => sum + a, 0)
    var rot = 0
    for (let i = 0; i < nums.length; i++) {
      rot = drawPath(nums[i], total, rot, i)
    }
  }

  function labelPaths(values) {
    var labels = values.map((str) => str[0])
    var elem = document.getElementById('pie-labels')
    elem.innerHTML = ''
    for (let i of labels) {
      elem.innerHTML += i
    }
  }

  function calculatePath(rot, newRo, big) {
    var dims = [
      100 * Math.cos(rot) + 102,
      100 * Math.sin(rot) + 102,
      100 * Math.cos(newRo) + 102,
      100 * Math.sin(newRo) + 102,
    ]
    return `M${dims[0]},${dims[1]} A100,100 0 ${big ? 1 : 0} 1 
			${dims[2]},${dims[3]} L102,102 A0,0 0 0 0 102,102 Z`
  }

  function drawPath(num, total, rot, count) {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    var ratio = num / total
    var newRo = rot + ratio * 6.28318531
    var d = calculatePath(rot, newRo, total < num * 2)
    var colors = document.getElementById('pie-color-info').value.split(',')
    document.getElementById('pie_chart').appendChild(path)
    path.setAttribute('d', d)
    path.setAttribute('fill', colors[count])
    path.setAttribute('id', `pie-chart-path-${count}`)
    path.setAttribute('stroke', 'black')
    path.setAttribute('stroke-width', '1')
    return newRo
  }

  function soloPath(data) {
    if (data.length === 1) {
      let num = parseFloat(data[0][1])
      if (isNaN(num)) {
        displayError(
          `The value in row 1 is not a number and no number could be extracted. Please make sure all values are numeric and all rows have a value.`
        )
        return true
      }
      if (num <= 0) {
        displayError(
          'Due to the nature of a pie chart, negative values are not permitted. If you wish to make a transparent field, edit the field color in settings.'
        )
        return true
      }
      let cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      var colors = document.getElementById('pie-color-info').value.split(',')
      document.getElementById('pie_chart').appendChild(cir)
      cir.setAttribute('cx', '102')
      cir.setAttribute('cy', '102')
      cir.setAttribute('r', '100')
      cir.setAttribute('fill', colors[0])
      cir.setAttribute('id', `pie-chart-path-${0}`)
      cir.setAttribute('stroke', 'black')
      cir.setAttribute('stroke-width', '1')
      labelPaths(data)
      return true
    }
    return false
  }

  function downloadConfirm() {
    downloadSvg(document.getElementById('pie_chart'))
  }

  function displayError(err) {
    setError(true)
    document.getElementById('error-text').innerHTML = err
  }

  return (
    <div id='pie-page'>
      <div>
        <div className='data-entry-option'>
          <h3>Data Entry Option:</h3>
          <br />
          <button
            className={csv ? '' : 'selected'}
            onClick={() => setCsv(false)}
          >
            Spreadsheet
          </button>
          <button
            className={csv ? 'selected' : ''}
            onClick={() => setCsv(true)}
          >
            CSV entry
          </button>
        </div>
        {csv ? (
          <div id='csv-entry'>
            <label>Data:</label>
            <input type='file' id='data-csv' accept='.csv' />
          </div>
        ) : (
          <>
            <div id='pie-build-ui'>
              <button
                onClick={() => {
                  data.split('\n').length >= 16
                    ? displayError('No more than 16 rows are permitted.')
                    : setData(data + '\n,')
                }}
              >
                New Row <b>十</b>
              </button>
            </div>
            <PieTable
              data={data}
              updateData={updateData}
              deleteRow={deleteRow}
            />
          </>
        )}
      </div>
      <div id='svg-functions'>
        <h3>Pie Chart:</h3>
        <svg
          id='pie_chart'
          xmlns='http://www.w3.org/2000/svg'
          width='204'
          height='204'
        >
          <circle
            cx='102'
            cy='102'
            r='100'
            fill='none'
            stroke='black'
            strokeWidth='1'
          ></circle>
        </svg>
        <button onClick={() => downloadConfirm()}>Download SVG</button>
        <div id='pie-labels'></div>
      </div>
      {csv ? (
        <div></div>
      ) : (
        <button id='build-pie-button' onClick={() => createChart()}>
          Build Chart
        </button>
      )}
      <button id='pie-control' onClick={() => setEditColors(true)}>
        Settings
      </button>
      <ColorModel visible={[editColors, setEditColors]} data={data} />
      <ErrorMessage visible={[error, setError]} />
    </div>
  )
}

export default PieChart
