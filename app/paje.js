"use client";
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function AppLogistica() {
  const [datos, setDatos] = useState([]);
  const [filtro, setFiltro] = useState('Pendiente');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      // Añadimos un estado inicial de "Pendiente" a cada registro
      const mappedData = data.map(item => ({ ...item, status: 'Pendiente' }));
      setDatos(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  const cambiarEstado = (id) => {
    setDatos(prev => prev.map(item => 
      item['Tracking Numbers'] === id 
      ? { ...item, status: item.status === 'Pendiente' ? 'Entregado' : 'Pendiente' } 
      : item
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Logística Última Milla</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8 border-2 border-dashed border-gray-300">
        <p className="mb-2 font-medium">Subir archivo Excel del día:</p>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setFiltro('Pendiente')} className={`px-4 py-2 rounded ${filtro === 'Pendiente' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Pendientes</button>
        <button onClick={() => setFiltro('Entregado')} className={`px-4 py-2 rounded ${filtro === 'Entregado' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Histórico/Entregados</button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="p-3">Tracking</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">City</th>
              <th className="p-3">Value</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {datos.filter(d => d.status === filtro).map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{item['Tracking Numbers']}</td>
                <td className="p-3">{item['Buyer']}</td>
                <td className="p-3">{item['Buyer City']}</td>
                <td className="p-3">${item['Value']}</td>
                <td className="p-3">
                  <button onClick={() => cambiarEstado(item['Tracking Numbers'])} className="text-blue-600 underline">
                    {item.status === 'Pendiente' ? 'Marcar Entregado' : 'Revertir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
