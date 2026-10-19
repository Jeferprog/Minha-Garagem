// Veículos de EXEMPLO (ilustração) mostrados na vitrine enquanto não há
// veículos reais "à venda" ou "reservados" cadastrados. Servem apenas para
// dar uma ideia de como a vitrine fica. Eles NÃO são salvos e somem assim
// que você cadastra um veículo de verdade com esses status.

// Gera uma "foto" ilustrativa (um carro desenhado em SVG sobre um fundo
// colorido), para não depender de imagens externas.
function fotoCarro(corA, corB, texto) {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'>" +
    "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
    "<stop offset='0' stop-color='" + corA + "'/>" +
    "<stop offset='1' stop-color='" + corB + "'/>" +
    "</linearGradient></defs>" +
    "<rect width='640' height='400' fill='url(#g)'/>" +
    "<g fill='#ffffff' opacity='0.95'>" +
    "<path d='M215 215 L255 162 Q262 152 274 152 L366 152 Q378 152 385 162 L425 215 Z'/>" +
    "<rect x='130' y='210' width='380' height='85' rx='22'/>" +
    "</g>" +
    "<circle cx='210' cy='300' r='34' fill='#1f2937'/>" +
    "<circle cx='210' cy='300' r='14' fill='#94a3b8'/>" +
    "<circle cx='430' cy='300' r='34' fill='#1f2937'/>" +
    "<circle cx='430' cy='300' r='14' fill='#94a3b8'/>" +
    "<text x='320' y='362' font-family='sans-serif' font-size='28' fill='#ffffff' " +
    "text-anchor='middle' opacity='0.95'>" + texto + "</text>" +
    "</svg>"
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export const VEICULOS_EXEMPLO = [
  {
    id: 'exemplo-1',
    marca: 'Honda',
    modelo: 'Civic Touring',
    ano: 2021,
    anoModelo: 2022,
    cor: 'Preto',
    quilometragem: 38000,
    precoVenda: 132900,
    mostrarPrecoNoSite: true,
    status: 'a_venda',
    fotos: [
      fotoCarro('#1e293b', '#475569', 'Honda Civic'),
      fotoCarro('#0f172a', '#1d4ed8', 'Honda Civic'),
    ],
    pendencias: [],
  },
  {
    id: 'exemplo-2',
    marca: 'Jeep',
    modelo: 'Renegade Longitude',
    ano: 2022,
    anoModelo: 2023,
    cor: 'Branco',
    quilometragem: 25000,
    precoVenda: 0,
    mostrarPrecoNoSite: false,
    status: 'reservado',
    fotos: [
      fotoCarro('#065f46', '#059669', 'Jeep Renegade'),
      fotoCarro('#1e3a8a', '#2563eb', 'Jeep Renegade'),
      fotoCarro('#334155', '#64748b', 'Jeep Renegade'),
    ],
    pendencias: [
      {
        id: 'exemplo-2-p1',
        descricao: 'Revisão completa realizada',
        custoEstimado: 0,
        custoReal: 0,
        resolvida: true,
        mostrarNoSite: true,
      },
    ],
  },
]
