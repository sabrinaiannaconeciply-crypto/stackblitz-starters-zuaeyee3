"use client";
import React, { useState } from 'react';

export default function Home() {
  const [produits, setProduits] = useState([
    {
      id: 1,
      nom: "Bougie Vanille & Ambre",
      createur: "Atelier Clara",
      prix: 18,
      categorie: "Bougies",
      image: "https://unsplash.com",
      tailles: ["Unique"],
    },
    {
      id: 2,
      nom: "Sweat Oversize Brodé",
      createur: "Léo Création",
      prix: 45,
      categorie: "Mode",
      image: "https://unsplash.com",
      tailles: ["S", "M", "L", "XL"],
    },
    {
      id: 3,
      nom: "Collier Perles d'Eau",
      createur: "Bijoux Mina",
      prix: 32,
      categorie: "Bijoux",
      image: "https://unsplash.com",
      tailles: ["Unique"],
    },
  ]);

  const [nom, setNom] = useState("");
  const [createur, setCreateur] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("Mode");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [enLive, setEnLive] = useState(true);
  const [produitEnDirect, setProduitEnDirect] = useState(1);
  const [tailleChoisie, setTailleChoisie] = useState("M");

  const gererPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files.item(0)!);
      setImagePreview(url);
    }
  };

  const ajouterProduit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !createur || !prix) return;
    if (produits.length >= 15) {
      alert("Limite gratuite atteinte (15 produits max) ! Passez à l'offre Pro à 10€/mois.");
      return;
    }
    const nouveau = {
      id: Date.now(),
      nom,
      createur,
      prix: Number(prix),
      categorie,
      image: imagePreview || "https://unsplash.com",
      tailles: categorie === "Mode" ? ["S", "M", "L", "XL"] : ["Unique"],
    };
    setProduits([nouveau, ...produits]);
    setProduitEnDirect(nouveau.id);
    setNom("");
    setPrix("");
    setImagePreview(null);
  };

  const articleLive = produits.find((p) => p.id === produitEnDirect) || produits.at(0);

 return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-black text-white p-5 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRÉA-LIVE MARKET</h1>
          <p className="text-xs text-gray-400">Vente & Live Shopping des jeunes créateurs • 0€ pour démarrer</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEnLive(!enLive)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
              enLive ? "bg-red-600 text-white animate-pulse" : "bg-gray-700 text-gray-200"
            }`}
          >
            {enLive ? "● LIVE EN COURS (Masquer)" : "○ Lancer un Live"}
          </button>
          <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-full">
            Gratuit : {produits.length} / 15 produits
          </span>
        </div>
      </header>

      {enLive && articleLive && (
        <section className="bg-zinc-900 text-white border-b border-zinc-800">
          <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6 items-center">
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-zinc-700 flex flex-col justify-between p-4">
              <img
                src={articleLive.image}
                alt={articleLive.nom}
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
              <div className="relative z-10 flex justify-between items-center">
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                  EN DIRECT • {articleLive.createur}
                </span>
                <span className="bg-black/70 text-xs px-2.5 py-1 rounded">👁️ 48 spectateurs</span>
              </div>
              <div className="relative z-10 bg-black/75 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-emerald-400 font-semibold">Article présenté à l'écran :</p>
                <p className="font-bold text-base">{articleLive.nom} — {articleLive.prix} €</p>
              </div>
            </div>

            <div className="bg-zinc-800 p-5 rounded-xl border border-zinc-700">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Achat instantané Live
              </span>
              <h2 className="text-2xl font-bold mt-1">{articleLive.nom}</h2>
              <p className="text-sm text-gray-300 mb-4">Créateur : {articleLive.createur}</p>

              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1.5">Choisissez votre taille :</p>
                <div className="flex gap-2">
                  {articleLive.tailles.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTailleChoisie(t)}
                      className={`px-3 py-1.5 rounded text-xs font-bold border ${
                        tailleChoisie === t
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 text-gray-300 border-zinc-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-700">
                <div>
                  <span className="text-xs text-gray-400 block">Prix Live</span>
                  <span className="text-2xl font-extrabold text-white">{articleLive.prix} €</span>
                </div>
                <button
                  onClick={() =>
                    alert(
                      `Commande Live enregistrée !\nArticle : ${articleLive.nom} (Taille : ${tailleChoisie})\nTotal : ${articleLive.prix}€\n\nVotre commission (5%) : ${(articleLive.prix * 0.05).toFixed(2)}€`
                    )
                  }
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-5 py-3 rounded-lg text-sm transition"
                >
                  ⚡ Bloquer & Payer ({articleLive.prix}€)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold mb-1">Ajouter une création</h2>
          <p className="text-xs text-gray-500 mb-4">Gratuit jusqu'à 15 articles (5% par vente)</p>

          <form onSubmit={ajouterProduit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Photo du produit</label>
              <input
                type="file"
                accept="image/*"
                onChange={gererPhoto}
                className="w-full text-xs border rounded-lg p-1.5 bg-gray-50"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Aperçu" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Votre marque / créateur</label>
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
              <label className="block text-xs font-semibold mb-1">Nom du produit</label>
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
                <label className="block text-xs font-semibold mb-1">Prix (€)</label>
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
                <label className="block text-xs font-semibold mb-1">Catégorie</label>
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
              + Publier avec photo
            </button>
          </form>
        </div>



        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Catalogue des créateurs</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {produits.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <img src={item.image} alt={item.nom} className="w-full h-40 object-cover" />
                  <div className="p-4 pb-0">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                        {item.categorie}
                      </span>
                      <button
                        onClick={() => {
                          setProduitEnDirect(item.id);
                          setEnLive(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[11px] text-red-600 font-bold hover:underline"
                      >
                        ▶ Présenter en Live
                      </button>
                    </div>
                    <h3 className="font-bold text-lg mt-2">{item.nom}</h3>
                    <p className="text-xs text-gray-500">Par <span className="font-medium text-gray-800">{item.createur}</span></p>
                  </div>
                </div>
                <div className="p-4 pt-3 mt-3 border-t flex justify-between items-center">
                  <span className="text-lg font-extrabold">{item.prix} €</span>
                  <button
                    onClick={() =>
                      alert(
                        `Simulation d'achat : ${item.nom} (${item.prix}€)\n\nPart créateur : ${(item.prix * 0.93).toFixed(2)}€\nVotre commission (5%) : ${(item.prix * 0.05).toFixed(2)}€`
                      )
                    }
                    className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    Acheter
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

