'use client';
import React, { useState } from 'react';

export default function Home() {
  const [produits, setProduits] = useState([
    {
      id: 1,
      nom: 'Bougie Vanille & Ambre',
      createur: 'Atelier Clara',
      prix: 18,
      categorie: 'Bougies',
    },
    {
      id: 2,
      nom: 'Tote Bag Brodé Main',
      createur: 'Léo Création',
      prix: 25,
      categorie: 'Mode',
    },
    {
      id: 3,
      nom: "Collier Perles d'Eau",
      createur: 'Bijoux Mina',
      prix: 32,
      categorie: 'Bijoux',
    },
  ]);

  const [nom, setNom] = useState('');
  const [createur, setCreateur] = useState('');
  const [prix, setPrix] = useState('');
  const [categorie, setCategorie] = useState('Mode');

  const ajouterProduit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !createur || !prix) return;
    if (produits.length >= 15) {
      alert(
        "Limite gratuite atteinte (15 produits max) ! Passez à l'offre Pro à 10€/mois."
      );
      return;
    }
    setProduits([
      { id: Date.now(), nom, createur, prix: Number(prix), categorie },
      ...produits,
    ]);
    setNom('');
    setPrix('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-black text-white p-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            CRÉA-LIVE MARKET
          </h1>
          <p className="text-xs text-gray-400">
            La plateforme des jeunes créateurs • 0€ pour démarrer
          </p>
        </div>
        <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">
          Plan Gratuit : {produits.length} / 15 produits
        </span>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold mb-1">Ajouter une création</h2>
          <p className="text-xs text-gray-500 mb-4">
            Gratuit jusqu'à 15 articles (5% commission par vente)
          </p>

          <form onSubmit={ajouterProduit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Nom de votre marque / créateur
              </label>
              <input
                type="text"
                placeholder="Ex: Atelier Sophie"
                value={createur}
                onChange={(e) => setCreateur(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Nom du produit
              </label>
              <input
                type="text"
                placeholder="Ex: Pull tricoté main"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  placeholder="29"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Catégorie
                </label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option>Mode</option>
                  <option>Bougies</option>
                  <option>Bijoux</option>
                  <option>Déco</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              + Publier gratuitement
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Dernières créations en vente</h2>
            <span className="text-xs bg-red-100 text-red-700 font-semibold px-2.5 py-1 rounded-full">
              ● Live Shopping bientôt actif
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {produits.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                    {item.categorie}
                  </span>
                  <h3 className="font-bold text-lg mt-2">{item.nom}</h3>
                  <p className="text-xs text-gray-500">
                    Par{' '}
                    <span className="font-medium text-gray-800">
                      {item.createur}
                    </span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <span className="text-lg font-extrabold">{item.prix} €</span>
                  <button
                    onClick={() =>
                      alert(
                        `Simulation d'achat : ${item.nom} (${
                          item.prix
                        }€)\n\nPart créateur : ${(item.prix * 0.93).toFixed(
                          2
                        )}€\nVotre commission : ${(item.prix * 0.05).toFixed(
                          2
                        )}€`
                      )
                    }
                    className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    Acheter maintenant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
