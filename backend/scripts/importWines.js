const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Wine = require('../models/Wine');

dotenv.config();

// Complete wine data with all your wines
const winesData = {
  reds: [
    // First 8 wines
    {
      winery: "Maselva",
      wine: "Emporda 2012",
      rating: { average: "4.9", reviews: "88 ratings" },
      location: "Spain · Empordà",
      image: "https://images.vivino.com/thumbs/ApnIiXjcT5Kc33OHgNb9dA_375x500.jpg",
      category: "reds",
      type: "Red",
      price: 42.47,
      vintage: "2012"
    },
    {
      winery: "Ernesto Ruffo",
      wine: "Amarone della Valpolicella Riserva N.V.",
      rating: { average: "4.9", reviews: "75 ratings" },
      location: "Italy · Amarone della Valpolicella",
      image: "https://images.vivino.com/thumbs/nC9V6L2mQQSq0s-wZLcaxw_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 44.26,
      vintage: "NV"
    },
    {
      winery: "Cartuxa",
      wine: "Pêra-Manca Tinto 1990",
      rating: { average: "4.9", reviews: "72 ratings" },
      location: "Portugal · Alentejo",
      image: "https://images.vivino.com/thumbs/L33jsYUuTMWTMy3KoqQyXg_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 46.06,
      vintage: "1990"
    },
    {
      winery: "Schrader",
      wine: "Cabernet Sauvignon RBS Beckstoffer To Kalon Vineyard 2015",
      rating: { average: "4.9", reviews: "72 ratings" },
      location: "United States · Oakville",
      image: "https://images.vivino.com/thumbs/GpcSXs2ERS6niDxoAsvESA_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 48.50,
      vintage: "2015"
    },
    {
      winery: "Hundred Acre",
      wine: "Wraith Cabernet Sauvignon 2013",
      rating: { average: "4.9", reviews: "68 ratings" },
      location: "United States · Napa Valley",
      image: "https://images.vivino.com/thumbs/PBhGMcRNQ7aVnVNr7VgnWA_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 52.30,
      vintage: "2013"
    },
    {
      winery: "Sine Qua Non",
      wine: "Ratsel Syrah N.V.",
      rating: { average: "4.9", reviews: "68 ratings" },
      location: "United States · California",
      image: "https://images.vivino.com/thumbs/ZzMKzqFqRO-6oI3ys3gGgQ_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 45.80,
      vintage: "NV"
    },
    {
      winery: "Del Dotto",
      wine: "The Beast Cabernet Sauvignon 2012",
      rating: { average: "4.9", reviews: "60 ratings" },
      location: "United States · Rutherford",
      image: "https://images.vivino.com/thumbs/easjTPIcS-mCQ99XoYOMgQ_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 43.15,
      vintage: "2012"
    },
    {
      winery: "Darioush",
      wine: "Darius II Cabernet Sauvignon 2016",
      rating: { average: "4.9", reviews: "59 ratings" },
      location: "United States · Napa Valley",
      image: "https://images.vivino.com/thumbs/U19RXtSdRMmoAesl2CBygA_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 47.90,
      vintage: "2016"
    },
    // New red wines (9-12)
    {
      winery: "Garbole",
      wine: "Hurlo 2009",
      rating: { average: "4.9", reviews: "55 ratings" },
      location: "Italy · Veneto",
      image: "https://images.vivino.com/thumbs/f_G1SS0eT_C6hZGGwdEZqA_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 44.50,
      vintage: "2009"
    },
    {
      winery: "Scarecrow",
      wine: "Cabernet Sauvignon 2016",
      rating: { average: "4.9", reviews: "54 ratings" },
      location: "United States · Rutherford",
      image: "https://images.vivino.com/thumbs/pU7uFKR-TAKAOQaf3Hpn2A_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 49.99,
      vintage: "2016"
    },
    {
      winery: "E. Guigal",
      wine: "Côte-Rôtie La Mouline 1990",
      rating: { average: "4.9", reviews: "54 ratings" },
      location: "France · Côte-Rôtie",
      image: "https://images.vivino.com/thumbs/HYVZMFigQ5qXxni7s9SpWw_pb_x300.png",
      category: "reds",
      type: "Red",
      price: 51.25,
      vintage: "1990"
    },
    {
      winery: "Chateau D Yquem",
      wine: "Chateau D Yquem 2001",
      rating: { average: "4.9", reviews: "50 ratings" },
      location: "France · Bordeaux",
      image: "https://images.vivino.com/thumbs/V5JCHLK_SxSiWxhghoQ1yQ_375x500.jpg",
      category: "reds",
      type: "Red",
      price: 53.75,
      vintage: "2001"
    }
  ],
  whites: [
    // First 8 whites
    {
      winery: "Domaine de La Romanée-Conti",
      wine: "Montrachet Grand Cru 2010",
      rating: { average: "4.9", reviews: "37 ratings" },
      location: "France · Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/rORmihtxSrKG7SfuI0bD6w_pb_x300.png",
      category: "whites",
      type: "White",
      price: 55.00,
      vintage: "2010"
    },
    {
      winery: "Domaine de La Romanée-Conti",
      wine: "Montrachet Grand Cru 2014",
      rating: { average: "4.9", reviews: "33 ratings" },
      location: "France · Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/rORmihtxSrKG7SfuI0bD6w_pb_x300.png",
      category: "whites",
      type: "White",
      price: 58.00,
      vintage: "2014"
    },
    {
      winery: "Domaine Coche-Dury",
      wine: "Meursault Les Rougeots 2001",
      rating: { average: "4.9", reviews: "25 ratings" },
      location: "France · Meursault",
      image: "https://images.vivino.com/thumbs/l5W5NRvZR_SzClIDSnG5Ag_pb_x300.png",
      category: "whites",
      type: "White",
      price: 52.50,
      vintage: "2001"
    },
    {
      winery: "Domaine Coche-Dury",
      wine: "Corton-Charlemagne Grand Cru N.V.",
      rating: { average: "4.8", reviews: "416 ratings" },
      location: "France · Corton-Charlemagne Grand Cru",
      image: "https://images.vivino.com/thumbs/ZGxHdQyGQt-hfJt7eNMXlA_pb_x300.png",
      category: "whites",
      type: "White",
      price: 49.00,
      vintage: "NV"
    },
    {
      winery: "Jarvis",
      wine: "Estate Finch Hollow Chardonnay (Cave Fermented) 2014",
      rating: { average: "4.8", reviews: "113 ratings" },
      location: "United States · Napa Valley",
      image: "https://images.vivino.com/thumbs/pQ_92smWRKG7Y7h5_ZwD-w_pb_x300.png",
      category: "whites",
      type: "White",
      price: 45.00,
      vintage: "2014"
    },
    {
      winery: "Château d'Yquem",
      wine: "Y 1996",
      rating: { average: "4.8", reviews: "96 ratings" },
      location: "France · Bordeaux Supérieur",
      image: "https://images.vivino.com/thumbs/6dP83oDrQy2Zv6es9tHp7w_pb_x300.png",
      category: "whites",
      type: "White",
      price: 51.00,
      vintage: "1996"
    },
    {
      winery: "Domaine Leflaive",
      wine: "Bâtard-Montrachet Grand Cru 1996",
      rating: { average: "4.8", reviews: "71 ratings" },
      location: "France · Bâtard-Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/EDQ4q_3FQ568NVspQBECug_pb_x300.png",
      category: "whites",
      type: "White",
      price: 53.00,
      vintage: "1996"
    },
    {
      winery: "Joseph Drouhin",
      wine: "Montrachet Grand Cru Marquis de Laguiche 2004",
      rating: { average: "4.8", reviews: "64 ratings" },
      location: "France · Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/1QoFUeYqQaCU07v4MBx8yw_pb_x300.png",
      category: "whites",
      type: "White",
      price: 56.00,
      vintage: "2004"
    },
    // New white wines (9-12)
    {
      winery: "Domaine Coche-Dury",
      wine: "Meursault Les Rougeots 2005",
      rating: { average: "4.8", reviews: "56 ratings" },
      location: "France · Meursault",
      image: "https://images.vivino.com/thumbs/l5W5NRvZR_SzClIDSnG5Ag_pb_x300.png",
      category: "whites",
      type: "White",
      price: 54.50,
      vintage: "2005"
    },
    {
      winery: "Olivier Leflaive",
      wine: "Bâtard-Montrachet Grand Cru 2012",
      rating: { average: "4.8", reviews: "55 ratings" },
      location: "France · Bâtard-Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/pWOdFPoyQ427uoHW_l941g_pb_x300.png",
      category: "whites",
      type: "White",
      price: 57.00,
      vintage: "2012"
    },
    {
      winery: "Joseph Drouhin",
      wine: "Montrachet Grand Cru Marquis de Laguiche 2002",
      rating: { average: "4.7", reviews: "44 ratings" },
      location: "France · Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/1QoFUeYqQaCU07v4MBx8yw_pb_x300.png",
      category: "whites",
      type: "White",
      price: 55.50,
      vintage: "2002"
    },
    {
      winery: "Domaine de La Romanée-Conti",
      wine: "Montrachet Grand Cru 1999",
      rating: { average: "4.8", reviews: "44 ratings" },
      location: "France · Montrachet Grand Cru",
      image: "https://images.vivino.com/thumbs/rORmihtxSrKG7SfuI0bD6w_pb_x300.png",
      category: "whites",
      type: "White",
      price: 59.00,
      vintage: "1999"
    }
  ],
  sparkling: [
    // First 8 sparkling
    {
      winery: "Krug",
      wine: "Clos d'Ambonnay Blanc de Noirs Brut Champagne 1995",
      rating: { average: "4.9", reviews: "92 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/DPq0ayGPR4SBeTDsYzLiiA_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 89.00,
      vintage: "1995"
    },
    {
      winery: "Dom Pérignon",
      wine: "P2 Plénitude Brut Champagne 1995",
      rating: { average: "4.9", reviews: "69 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/n5By4_iWSS2Zmf7anQtL_Q_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 85.00,
      vintage: "1995"
    },
    {
      winery: "Perrier-Jouët",
      wine: "Belle Epoque Brut Champagne 1979",
      rating: { average: "4.9", reviews: "42 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/B976g0gBR1G4iniATCCKIQ_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 95.00,
      vintage: "1979"
    },
    {
      winery: "Louis Roederer",
      wine: "Brut Premier Champagne 1993",
      rating: { average: "4.9", reviews: "36 ratings" },
      location: "France · Champagne Premier Cru",
      image: "https://images.vivino.com/thumbs/3PMfb042TN-5ZzzqkBEIHA_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 78.00,
      vintage: "1993"
    },
    {
      winery: "Dom Pérignon",
      wine: "Oenothèque Brut Champagne 1976",
      rating: { average: "4.9", reviews: "31 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/-2XJ5LS9T0uFnEuseMmNvg_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 99.00,
      vintage: "1976"
    },
    {
      winery: "Bollinger",
      wine: "Vieilles Vignes Françaises Blanc de Noirs Brut Champagne 1997",
      rating: { average: "4.9", reviews: "31 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/yYHkkUczRVaBfBBl1NAoww_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 88.00,
      vintage: "1997"
    },
    {
      winery: "Taittinger",
      wine: "Comtes de Champagne Blanc de Blancs 1983",
      rating: { average: "4.9", reviews: "29 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/5DnUGr-_SwOGKMxb1KuuGA_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 92.00,
      vintage: "1983"
    },
    {
      winery: "Krug",
      wine: "Clos du Mesnil Blanc de Blancs Brut Champagne 1985",
      rating: { average: "4.9", reviews: "26 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/xtWMPmF6RtKFoWz3kpxz4Q_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 97.00,
      vintage: "1985"
    },
    // New sparkling wines (9-12)
    {
      winery: "Dom Pérignon",
      wine: "P3 Plénitude Brut Champagne 1985",
      rating: { average: "4.9", reviews: "25 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/URFBcLe4TNar72CXLie8Kg_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 94.00,
      vintage: "1985"
    },
    {
      winery: "Krug",
      wine: "Clos d'Ambonnay Blanc de Noirs Brut Champagne N.V.",
      rating: { average: "4.8", reviews: "537 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/DPq0ayGPR4SBeTDsYzLiiA_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 86.00,
      vintage: "NV"
    },
    {
      winery: "Krug",
      wine: "Clos du Mesnil Blanc de Blancs Brut Champagne 2000",
      rating: { average: "4.8", reviews: "275 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/xtWMPmF6RtKFoWz3kpxz4Q_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 91.00,
      vintage: "2000"
    },
    {
      winery: "Louis Roederer",
      wine: "Cristal Brut Champagne (Millésimé) 1990",
      rating: { average: "4.8", reviews: "212 ratings" },
      location: "France · Champagne",
      image: "https://images.vivino.com/thumbs/bXZK_MhMQi-a2xrjEITv2A_pb_x300.png",
      category: "sparkling",
      type: "Sparkling",
      price: 98.00,
      vintage: "1990"
    }
  ],
  rose: [
    // First 8 rose
    {
      winery: "Antica Terra",
      wine: "Angelicall Rosé 2014",
      rating: { average: "4.7", reviews: "33 ratings" },
      location: "United States · Willamette Valley",
      image: "https://images.vivino.com/thumbs/LRmcfSasTD22xR6lRSKcIw_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 35.00,
      vintage: "2014"
    },
    {
      winery: "Antinori",
      wine: "Fonte de' Medici 2011",
      rating: { average: "4.6", reviews: "199 ratings" },
      location: "Italy · Vino d'Italia",
      image: "https://images.vivino.com/highlights/icon/top_ranked.svg",
      category: "rose",
      type: "Rosé",
      price: 32.00,
      vintage: "2011"
    },
    {
      winery: "Minuty",
      wine: "281 Rosé 2014",
      rating: { average: "4.6", reviews: "39 ratings" },
      location: "France · Provence",
      image: "https://images.vivino.com/thumbs/CRBSmK3xRuqHdCg4TpBpVw_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 38.00,
      vintage: "2014"
    },
    {
      winery: "Château Saint-Maur",
      wine: "Clos de Capelune Côtes de Provence Rosé 2017",
      rating: { average: "4.6", reviews: "34 ratings" },
      location: "France · Côtes de Provence",
      image: "https://images.vivino.com/thumbs/l7BLBu7ERi2tJIQqtli_NA_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 34.00,
      vintage: "2017"
    },
    {
      winery: "Villa M",
      wine: "Rosé 2016",
      rating: { average: "4.6", reviews: "33 ratings" },
      location: "Italy · Piemonte",
      image: "https://images.vivino.com/thumbs/__JeiUHGQ5KF6LBGEREllw_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 36.00,
      vintage: "2016"
    },
    {
      winery: "Minuty",
      wine: "281 Rosé 2017",
      rating: { average: "4.5", reviews: "152 ratings" },
      location: "France · Provence",
      image: "https://images.vivino.com/thumbs/CRBSmK3xRuqHdCg4TpBpVw_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 37.00,
      vintage: "2017"
    },
    {
      winery: "Castello di Amorosa",
      wine: "La Fantasia 2015",
      rating: { average: "4.5", reviews: "150 ratings" },
      location: "United States · California",
      image: "https://images.vivino.com/highlights/icon/top_ranked.svg",
      category: "rose",
      type: "Rosé",
      price: 33.00,
      vintage: "2015"
    },
    {
      winery: "Château d'Esclans",
      wine: "Garrus Rosé 2017",
      rating: { average: "4.5", reviews: "148 ratings" },
      location: "France · Côtes de Provence",
      image: "https://images.vivino.com/thumbs/NGq7QIE3QwSE0cAKrvPuTA_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 39.00,
      vintage: "2017"
    },
    // New rose wines (9-12)
    {
      winery: "Minuty",
      wine: "281 Rosé 2016",
      rating: { average: "4.5", reviews: "147 ratings" },
      location: "France · Provence",
      image: "https://images.vivino.com/thumbs/CRBSmK3xRuqHdCg4TpBpVw_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 37.50,
      vintage: "2016"
    },
    {
      winery: "Château d'Esclans",
      wine: "Garrus Rosé 2010",
      rating: { average: "4.5", reviews: "115 ratings" },
      location: "France · Côtes de Provence",
      image: "https://images.vivino.com/thumbs/NGq7QIE3QwSE0cAKrvPuTA_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 41.00,
      vintage: "2010"
    },
    {
      winery: "Blankiet",
      wine: "Prince of Hearts Rosé N.V.",
      rating: { average: "4.5", reviews: "77 ratings" },
      location: "United States · Napa Valley",
      image: "https://images.vivino.com/thumbs/BXIqIzVzT2OwkLs59qSPig_pb_x300.png",
      category: "rose",
      type: "Rosé",
      price: 35.50,
      vintage: "NV"
    },
    {
      winery: "Bodegas Vilano",
      wine: "Think Pink Rosado 2017",
      rating: { average: "4.5", reviews: "76 ratings" },
      location: "Spain · Ribera del Duero",
      image: "https://images.vivino.com/highlights/icon/most_user_rated.svg",
      category: "rose",
      type: "Rosé",
      price: 34.50,
      vintage: "2017"
    }
  ]
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing wines
    const deleted = await Wine.deleteMany();
    console.log(`Cleared ${deleted.deletedCount} existing wines`);
    
    // Import all wines
    let totalImported = 0;
    
    for (const category of ['reds', 'whites', 'rose', 'sparkling']) {
      const wines = winesData[category];
      if (wines && wines.length > 0) {
        await Wine.insertMany(wines);
        totalImported += wines.length;
        console.log(`✅ Imported ${wines.length} ${category} wines`);
      }
    }
    
    console.log(`\n🎉 Success! Imported ${totalImported} total wines to MongoDB!`);
    console.log(`   - Reds: ${winesData.reds.length}`);
    console.log(`   - Whites: ${winesData.whites.length}`);
    console.log(`   - Rosé: ${winesData.rose.length}`);
    console.log(`   - Sparkling: ${winesData.sparkling.length}`);
    
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();