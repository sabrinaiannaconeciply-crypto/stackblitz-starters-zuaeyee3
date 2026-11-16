"use client";
import React, { useState, useEffect } from "react";

const SUPABASE_URL = "https://lbfiefjlwbnjyeevbbgt.supabase.co";
const SUPABASE_KEY = "sb_publishable_DmL4w5261IAmpabfQcZV1Q_GsaeAc7P";

interface Produit {
  id: number;
  nom: string;
  createur: string
  prix: number;
  categorie: string;
  image?: string;
}

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const [nom, setNom] = useState("");
  const [createur, setCreateur] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("Mode");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [enLive, setEnLive] = useState(true);
  const [produitEnDirect, setProduitEnDirect] = useState<number | null>(null);
  const [tailleChoisie, setTailleChoisie] = useState("M");
  const chargerProduits = () => {
    try {
      const sauvegarde = localStorage.getItem("crea_live_produits");
      if (sauvegarde) {
        const data = JSON.parse(sauvegarde);
        setProduits(data);
        if (data.length > 0 && !produitEnDirect) {
          setProduitEnDirect(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const gererPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const f = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxLargeur = 700;
        const echelle = Math.min(1, maxLargeur / img.width);
        canvas.width = img.width * echelle;
        canvas.height = img.height * echelle;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImagePreview(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  const ajouterProduit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !createur || !prix) return;
    if (produits.length >= 15) {
      alert("Limite gratuite atteinte (15 produits max) ! Passez à l'offre Pro à 10€/mois.");
      return;
    }

    const nouveau: Produit = {
      id: Date.now(),
      nom,
      createur,
      prix: Number(prix),
      categorie,
      image: imagePreview || "",
    };

    const nouvelleListe = [nouveau, ...produits];
    setProduits(nouvelleListe);
    localStorage.setItem("crea_live_produits", JSON.stringify(nouvelleListe));
    setProduitEnDirect(nouveau.id);
    setEnLive(true);
    setNom("");
    setPrix("");
    setImagePreview(null);
  };

  const supprimerProduit = (id: number) => {
    const nouvelleListe = produits.filter((p) => p.id !== id);
    setProduits(nouvelleListe);
    localStorage.setItem("crea_live_produits", JSON.stringify(nouvelleListe));
  };

    
  };

  const articleLive = produits.find((p) => p.id === produitEnDirect) || produits[0];
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-black text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">CRÉA-LIVE MARKET</h1>
          <p className="text-xs text-gray-400">Vente &amp; Live Shopping des jeunes créateurs</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-600 px-3 py-1 rounded-full font-semibold">
            Gratuit : {produits.length} / 15 produits
          </span>
          <button
            onClick={() => setEnLive(!enLive)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            {enLive ? "Fermer le Live" : "Lancer le Live"}
          </button>
        </div>
      </header>

      {enLive && articleLive && (
        <section className="bg-gradient-to-r from-zinc-900 via-neutral-900 to-black text-white p-6 border-b border-zinc-800">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-center">
            <div className="relative bg-zinc-800 rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center border border-zinc-700">
              {articleLive.image ? (
                <img src={articleLive.image} alt={articleLive.nom} className="w-full h-full object-cover" />
              ) : (
                <p className="text-zinc-400 text-sm">Caméra du créateur en direct</p>
              )}
              <span className="absolute top-3 left-3 bg-red-600 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                ● EN DIRECT
              </span>
              <span className="absolute bottom-3 left-3 bg-black/70 text-xs px-2.5 py-1 rounded">
                👁 142 acheteurs connectés
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Article présenté en direct
                </span>
                <select
                  value={articleLive.id}
                  onChange={(e) => setProduitEnDirect(Number(e.target.value))}
                  className="bg-zinc-800 text-xs border border-zinc-700 rounded px-2 py-1"
                >
                  {produits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({p.prix}€)
                    </option>
                  ))}
                </select>
              </div>

              <h2 className="text-2xl font-bold">{articleLive.nom}</h2>
              <p className="text-sm text-zinc-400">
                Création originale par <strong className="text-white">{articleLive.createur}</strong>
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Taille :</span>
                {["XS", "S", "M", "L", "Unique"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTailleChoisie(t)}
                    className={`px-2.5 py-1 text-xs rounded border ${
                      tailleChoisie === t
                        ? "bg-white text-black font-bold border-white"
                        : "border-zinc-700 text-zinc-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-400">Prix Direct Live</p>
                  <p className="text-3xl font-extrabold text-emerald-400">{articleLive.prix} €</p>
                </div>
                <button
                  onClick={() =>
                    alert(
                      `Commande Live enregistrée !\nArticle : ${articleLive.nom} (Taille : ${tailleChoisie})\nTotal : ${articleLive.prix}€\n\nVotre commission (5%) : ${(articleLive.prix * 0.05).toFixed(2)}€`
                    )
                  }
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-5 py-3 rounded-lg text-sm transition"
                >
                  ⚡ Bloquer &amp; Payer ({articleLive.prix}€)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold mb-1">Ajouter une création</h2>
          <p className="text-xs text-gray-500 mb-4">Gratuit pour 15 articles max (5% par vente)</p>

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
                placeholder="Ex: Cape chocolat"
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
                  placeholder="30"
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
              disabled={envoiEnCours}
              className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
            >
              {envoiEnCours ? "Enregistrement en cours..." : "+ Publier avec photo"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Catalogue des créateurs</h2>

          {chargement ? (
            <p className="text-sm text-gray-500">Chargement du catalogue...</p>
          ) : produits.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
              <p className="font-semibold text-gray-700">Aucun produit publié pour le moment</p>
              <p className="text-xs mt-1">Utilisez le formulaire à gauche pour publier votre première création avec photo !</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {produits.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    {item.image && (
                      <img src={item.image} alt={item.nom} className="w-full h-44 object-cover" />
                    )}
                    <div className="p-4 pb-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[11px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                          {item.categorie}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setProduitEnDirect(item.id);
                              setEnLive(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-[11px] text-red-600 font-bold hover:underline"
                          >
                            ▶ Live
                          </button>
                          <button
                            onClick={() => supprimerProduit(item.id)}
                              className="text-[11px] text-gray-400 hover:text-red-600 font-semibold"
                              >
                                ✕ Supprimer
                              </button>
                            </div>
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
              )}
            </div>
          </main>
        </div>
      );