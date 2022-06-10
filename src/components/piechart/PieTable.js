function PieTable({ data, updateData, deleteRow }) {
  return (
    <table>
      <tbody>
        <tr>
          <th style={{ width: '45%' }}>Field</th>
          <th style={{ width: '45%' }}>Value</th>
          <th className='no-border' style={{ width: '10%' }}></th>
        </tr>
        {data.split('\n').map((row, i) => (
          <tr key={i}>
            <td>
              <input
                className='pie-field-input'
                value={row.split(',')[0]}
                onChange={(e) => updateData(i, 0, e.target.value)}
              />
            </td>
            <td>
              <input
                type='number'
                className='pie-value-input'
                value={row.split(',')[1]}
                onChange={(e) => updateData(i, 1, e.target.value)}
              />
            </td>
            <td className='no-border'>
              <button onClick={() => deleteRow(i)}>一</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PieTable
