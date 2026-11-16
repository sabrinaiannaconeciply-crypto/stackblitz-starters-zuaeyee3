"use client";
import React, { useState, useEffect } from 'react';

const SUPABASE_URL = "https://fbfnefjwibnjyeevbkgt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZmllZmppd2JuanllZXZiYmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4Mzc2OTEsImV4cCI6MjExMDQxMzY5MX0.qnhxy074NVHqSUDF4UGx1U__mrzRZ8GYy_5n4c8cvVg";


interface Produit {
  id: number;
  nom: string;
  createur: string;
  prix: number;
  categorie: string;
  image: string;
}

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const [nom, setNom] = useState("");
  const [createur, setCreateur] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("Mode");
  const [fichierPhoto, setFichierPhoto] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [enLive, setEnLive] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");
  const [produitEnDirect, setProduitEnDirect] = useState<number | null>(null);
  const [tailleChoisie, setTailleChoisie] = useState("M");

  const headersSupabase = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  const chargerProduits = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/produits?select=*&order=created_at.desc`, {
        headers: headersSupabase,
      });
      if (res.ok) {
        const data = await res.json();
        setProduits(data);
        if (data.length > 0 && !produitEnDirect) {
          setProduitEnDirect(data[0].id);
        }
      }
    } catch (err) {
      console.error("Erreur chargement :", err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const gererPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files.item(0)!;
      setFichierPhoto(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const ajouterProduit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !createur || !prix) return;
    if (produits.length >= 15) {
      alert("Limite gratuite atteinte (15 produits max) ! Passez à l'offre Pro à 10€/mois.");
      return;
    }

    setEnvoiEnCours(true);
    let urlImageFinale = "";

    try {
      if (fichierPhoto) {
        const nomFichier = `${Date.now()}-${fichierPhoto.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${nomFichier}`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": fichierPhoto.type,
          },
          body: fichierPhoto,
        });

        if (uploadRes.ok) {
          urlImageFinale = `${SUPABASE_URL}/storage/v1/object/public/photos/${nomFichier}`;
        }
      }

      const saveRes = await fetch(`${SUPABASE_URL}/rest/v1/produits`, {
        method: "POST",
        headers: {
          ...headersSupabase,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          nom,
          createur,
          prix: Number(prix),
          categorie,
          image: urlImageFinale,
        }),
      });

      if (saveRes.ok) {
        const [nouveau] = await saveRes.json();
        setProduits([nouveau, ...produits]);
        setProduitEnDirect(nouveau.id);
        setEnLive(true);
        setNom("");
        setPrix("");
        setFichierPhoto(null);
        setImagePreview(null);
      } else {
        alert("Vérifiez que votre clé SUPABASE_KEY est bien collée à la ligne 5 !");
      }
    } catch (err) {
      alert("Erreur lors de la publication.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const supprimerProduit = async (id: number) => {
    await fetch(`${SUPABASE_URL}/rest/v1/produits?id=eq.${id}`, {
      method: "DELETE",
      headers: headersSupabase,
    });
    const misAJour = produits.filter((p) => p.id !== id);
    setProduits(misAJour);
    if (produitEnDirect === id) {
      setProduitEnDirect(misAJour.length > 0 ? misAJour[0].id : null);
    }
  };

  const articleLive = produits.find((p) => p.id === produitEnDirect) || produits[0];
  const taillesArticle = articleLive?.categorie === "Mode" ? ["S", "M", "L", "XL"] : ["Unique"];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-black text-white p-5 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRÉA-LIVE MARKET</h1>
          <p className="text-xs text-gray-400">Vente & Live Shopping des jeunes créateurs • 0€ pour démarrer</p>
        </div>
        <div className="flex items-center gap-3">
          {produits.length > 0 && (
            <button
              onClick={() => setEnLive(!enLive)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                enLive ? "bg-red-600 text-white animate-pulse" : "bg-gray-700 text-gray-200"
              }`}
            >
              {enLive ? "● LIVE EN COURS (Masquer)" : "○ Ouvrir le Live"}
            </button>
          )}
          <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-full">
            Gratuit : {produits.length} / 15 produits
          </span>
        </div>
      </header>

      {enLive && articleLive && (
        <section className="bg-zinc-900 text-white border-b border-zinc-800">
          <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-zinc-700 flex flex-col justify-between p-4">
                {youtubeId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://youtube.com{youtubeId}?autoplay=1`}
                    title="Live Créateur"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    {articleLive.image ? (
                      <img
                        src={articleLive.image}
                        alt={articleLive.nom}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                        Aperçu produit en direct
                      </div>
                    )}
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                        EN DIRECT • {articleLive.createur}
                      </span>
                    </div>
                    <div className="relative z-10 bg-black/75 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-xs text-emerald-400 font-semibold">Article présenté en direct :</p>
                      <p className="font-bold text-base">{articleLive.nom} — {articleLive.prix} €</p>
                    </div>
                  </>
                )}
              </div>
              <input
                type="text"
                placeholder="Optionnel : collez l'ID vidéo YouTube Live (ex: dQw4w9WgXcQ)"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-400"
              />
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
                  {taillesArticle.map((t) => (
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
          <p className="text-xs text-gray-500 mb-4">Gratuit pour 15 articles max (5% par vente)</p>

          <form onSubmit={ajouterProduit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Photo du produit</label>
              <input
                type="file"
                accept="image/*"
                onChange={gererPhoto}
                className="w-full text-xs border rounded-lg p-1.5 bg-gray-50"
                required
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
}

