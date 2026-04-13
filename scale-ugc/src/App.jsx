import React, { useState } from 'react';
import { Sparkles, Upload, CheckCircle, ImageIcon, ChevronRight, MessageSquare, Loader2, LayoutPanelLeft, RefreshCcw, Video } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    faceImage: null,
    category: '',
    productDetail: '',
    setting: '',
    vibe: ''
  });

  const categories = ['Pakaian (Baju/Celana)', 'Jilbab / Hijab', 'Sepatu / Alas Kaki', 'Makanan / Minuman', 'Skincare / Kosmetik', 'Aksesoris'];
  const settingSuggestions = ['Studio Minimalis Putih', 'Kafe Estetik', 'Kamar Tidur Cozy', 'Jalanan Kota (Street Style)', 'Alam Terbuka / Taman'];
  const vibeSuggestions = ['Cinematic & Dramatis', 'Edgy & Bold', 'Fun & Ceria', 'Elegan & Mewah', 'Casual & Santai'];

  const handleNext = () => setStep(step + 1);
  const handleReset = () => {
    setStep(1);
    setActiveTab(0);
    setFormData({ faceImage: null, category: '', productDetail: '', setting: '', vibe: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, faceImage: imageUrl });
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setFormData({ ...formData, faceImage: null });
  };

  const simulateGeminiGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  const generateGeminiPoses = () => {
    const { category, productDetail, setting, vibe } = formData;
    const prod = productDetail || '[Produk]';
    const set = setting || '[Latar]';
    const vb = vibe || '[Suasana]';
    const faceRef = formData.faceImage ? "(Use attached face reference) " : "";

    const templates = {
      'Pakaian (Baju/Celana)': [
        { name: "Full-Body OOTD", desc: "Berdiri tegak menampilkan keseluruhan jatuhnya kain", img: "Full-body shot, walking confidently. Focus on the realistic fabric folds.", vid: "Camera tracks the character as they walk forward confidently." },
        { name: "Half-Body Detail", desc: "Fokus pada tekstur jahitan dan potongan baju", img: "Medium shot from the waist up. Sharp focus on fabric texture.", vid: "Slow push-in shot as the character adjusts their collar." },
        { name: "Dynamic Twirl", desc: "Pose memutar untuk efek dramatis pada pakaian", img: "Action shot, character twirling gracefully. Fabric flies dynamically.", vid: "Character does a slow-motion twirl, clothing flares out beautifully." },
        { name: "Casual Leaning", desc: "Menyandar santai untuk kesan lifestyle", img: "Character leaning casually against a wall. Natural draping.", vid: "Character leans against a surface, looking relaxed." },
        { name: "Over-the-Shoulder", desc: "Menoleh dari belakang memamerkan detail", img: "Shot from behind, character looking over shoulder.", vid: "Camera starts from behind and pans as the character turns." }
      ],
      'Sepatu / Alas Kaki': [
        { name: "Action Stepping", desc: "Pose melangkah, fokus tajam pada sepatu", img: "Low-angle dynamic shot focusing heavily on the shoes.", vid: "Low camera angle tracking the feet as they take stylish steps." },
        { name: "Tying Shoelaces", desc: "Berjongkok mengikat tali sepatu", img: "Character crouching down tying laces. Close up macro shot.", vid: "Close-up of hands tying laces, then tilting up to face." },
        { name: "Crossed Legs Sitting", desc: "Duduk santai menyilangkan kaki", img: "Character sitting on a ledge with legs extended and crossed.", vid: "Character sits down and extends legs playfully towards camera." },
        { name: "Mid-Air Jump", desc: "Melompat, menyorot desain keseluruhan", img: "Action photography, character suspended mid-air in a jump.", vid: "Slow-motion clip of character jumping, freezing at the peak." },
        { name: "Shoe in Hand", desc: "Karakter memegang dan memamerkan sepatu", img: "Character holding one shoe up close to the camera.", vid: "Character holds the shoe, rotating it slowly to show angles." }
      ],
      'Jilbab / Hijab': [
        { name: "Elegant Drape", desc: "Berdiri elegan membiarkan jilbab menjuntai", img: "Portrait shot. Focus on the elegant drape of the hijab.", vid: "Character stands elegantly, a soft breeze moving the fabric." },
        { name: "Adjusting Edge", desc: "Tangan merapikan ujung jilbab", img: "Medium close-up. Character adjusting the edge of the hijab.", vid: "Slow motion of character gracefully pinning their hijab." },
        { name: "Windy Flow", desc: "Efek angin menerpa jilbab", img: "Cinematic shot. Gentle wind blowing the hijab slightly backward.", vid: "Cinematic breeze moves the hijab as character looks at camera." },
        { name: "Over-the-Shoulder", desc: "Menoleh ke belakang memamerkan cutting", img: "Character looking over shoulder, showing how the hijab falls.", vid: "Camera glides around character showing the hijab's volume." },
        { name: "Close-Up Face", desc: "Fokus pada wajah dan material jilbab", img: "Macro close up on face and hijab material texture.", vid: "Extreme close-up on face, panning to show fabric weave." }
      ]
    };

    const defaultPoses = [
      { name: "Front Facing Stand", desc: "Berdiri tegak menghadap kamera", img: "Standard portrait standing facing the camera.", vid: "Character stands still and smiles, presenting the product." },
      { name: "Casual Hold", desc: "Memegang produk dengan santai", img: "Holding the product casually. Medium shot.", vid: "Character holds the product and looks at it thoughtfully." }
    ];

    const selectedPoses = templates[category] || defaultPoses;

    return selectedPoses.map(pose => ({
      name: pose.name,
      description: pose.desc,
      imagePrompt: `Photorealistic portrait of an Indonesian character. ${faceRef}They are showcasing ${prod}. [POSE: ${pose.img}] Set in ${set}. Atmosphere: ${vb}. 8k resolution, cinematic lighting, 35mm lens.`,
      videoPrompt: `Cinematic short video clip in ${set}. Showcasing ${prod}. [ACTION: ${pose.vid}] Atmosphere: ${vb}. High quality, realistic lighting.`
    }));
  };

  const generatedResults = generateGeminiPoses();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3" /> Powered by Gemini AI
          </div>
          <h1 className="text-3xl font-bold">Affiliate Prompt Generator</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Upload className="w-5 h-5" /> Langkah 1: Input Produk</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 relative">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {formData.faceImage ? <img src={formData.faceImage} className="absolute inset-0 w-full h-full object-cover opacity-40" /> : <ImageIcon className="w-8 h-8 text-indigo-600 mb-2" />}
                  <span className="font-semibold">{formData.faceImage ? "Gambar Terpilih" : "Unggah Wajah (Opsional)"}</span>
                </label>
                <div className="space-y-4">
                  <select className="w-full p-3 border rounded-lg" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input type="text" placeholder="Detail Produk (Cth: Kemeja Hijau)" className="w-full p-3 border rounded-lg" value={formData.productDetail} onChange={(e) => setFormData({...formData, productDetail: e.target.value})} />
                  <button onClick={handleNext} disabled={!formData.category} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold">Lanjut</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Langkah 2: Detail Suasana</h2>
              <div className="space-y-6">
                <input type="text" placeholder="Latar Belakang (Cth: Kafe)" className="w-full p-3 border rounded-lg" value={formData.setting} onChange={(e) => setFormData({...formData, setting: e.target.value})} />
                <input type="text" placeholder="Vibe (Cth: Elegan)" className="w-full p-3 border rounded-lg" value={formData.vibe} onChange={(e) => setFormData({...formData, vibe: e.target.value})} />
                <button onClick={simulateGeminiGeneration} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold">
                  {isGenerating ? <Loader2 className="animate-spin inline mr-2" /> : "Generate 5 Opsi"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col md:row min-h-[500px]">
              <div className="w-full md:w-1/3 border-r bg-slate-50 p-6">
                <h3 className="font-bold mb-4">5 Rekomendasi Pose</h3>
                {generatedResults.map((result, idx) => (
                  <button key={idx} onClick={() => setActiveTab(idx)} className={`w-full text-left p-4 rounded-xl mb-2 border ${activeTab === idx ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                    <div className="text-xs font-bold uppercase">Opsi {idx + 1}</div>
                    <div className="font-bold">{result.name}</div>
                  </button>
                ))}
                <button onClick={handleReset} className="w-full mt-4 p-2 text-sm border rounded-lg bg-white"><RefreshCcw className="inline w-4 h-4 mr-1" /> Reset</button>
              </div>
              <div className="w-full md:w-2/3 p-8">
                <h2 className="text-2xl font-bold mb-4">{generatedResults[activeTab].name}</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <div className="font-bold text-indigo-600 mb-2">Image Prompt</div>
                    <p className="text-sm">{generatedResults[activeTab].imagePrompt}</p>
                  </div>
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <div className="font-bold text-blue-600 mb-2">Video Prompt</div>
                    <p className="text-sm">{generatedResults[activeTab].videoPrompt}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}