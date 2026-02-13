from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI(title="Scent Discovery API", version="1.0.0")

# --- CORS (Frontend ile Backend konuşsun diye şart) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme aşamasında herkese izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL VERİ DEĞİŞKENLERİ ---
metadata_df = None
recommendations_df = None

@app.on_event("startup")
def load_data():
    global metadata_df, recommendations_df
    print("⏳ Veriler yükleniyor...")
    
    # Dosya yollarını kontrol et
    base_path = os.path.dirname(os.path.abspath(__file__))
    meta_path = os.path.join(base_path, "data/perfume_metadata.parquet")
    recs_path = os.path.join(base_path, "data/perfume_recommendations.parquet")
    
    try:
        metadata_df = pd.read_parquet(meta_path)
        recommendations_df = pd.read_parquet(recs_path)
        print(f"✅ Veriler RAM'e yüklendi! Toplam Parfüm: {len(metadata_df)}")
    except Exception as e:
        print(f"❌ HATA: Veri dosyaları okunamadı! {e}")

# --- YARDIMCI FONKSİYONLAR ---
def get_image_url(original_url):
    # Fragrantica URL'sinden görsel çekmek zor (403 verir).
    # MVP için placeholder veya frontend tarafında statik görsel kullanacağız.
    # Şimdilik orijinal linki dönelim.
    return str(original_url) if original_url else ""

def calculate_vibes(row):
    # Basit bir "Vibe" algoritması (MVP için)
    # Notalara bakıp etiket yapıştıracağız
    accords = str(row.get('Main Accord 1', '')).lower()
    
    vibes = []
    if 'citrus' in accords or 'fresh' in accords: vibes.append("Fresh 🍋")
    if 'woody' in accords: vibes.append("Woody 🌲")
    if 'sweet' in accords or 'vanilla' in accords: vibes.append("Sexy 🔥")
    if 'floral' in accords: vibes.append("Elegant 🌸")
    if 'spicy' in accords: vibes.append("Bold 🌶️")
    
    return vibes[:3] # En fazla 3 vibe dön

# --- ENDPOINTLER ---

@app.get("/")
def home():
    return {"message": "Scent Discovery API is running! 🚀"}

@app.get("/search")
def search_perfume(q: str = Query(..., min_length=2)):
    """
    Frontend'deki 'Type a perfume you like...' kutusu için.
    """
    if metadata_df is None:
        raise HTTPException(status_code=503, detail="Data not loaded yet")
    
    # Büyük/küçük harf duyarsız arama
    # contains(q) -> içinde q geçenleri bul
    results = metadata_df[metadata_df['Perfume'].str.contains(q, case=False, na=False)].head(10)
    
    response = []
    for idx, row in results.iterrows():
        response.append({
            "id": int(idx), # Parquet index'i ID olarak kullanıyoruz
            "name": row['Perfume'],
            "brand": row['Brand'],
            "full_name": f"{row['Brand']} - {row['Perfume']}",
            "year": row.get('Year', '')
        })
        
    return response

@app.get("/recommend/{perfume_id}")
def get_recommendations(perfume_id: int):
    """
    Hero Card ve Alternatifleri döndüren ana endpoint.
    """
    if metadata_df is None or recommendations_df is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    # 1. Seçilen parfüm var mı?
    if perfume_id not in metadata_df.index:
        raise HTTPException(status_code=404, detail="Perfume not found")
        
    # 2. Seçilen parfümün detayları (SEED)
    seed_perfume = metadata_df.loc[perfume_id]
    
    # 3. Önerileri bul
    # recommendations_df'de 'perfume_id' sütunu üzerinden arama yapıyoruz
    # Dikkat: Index değil, sütun olarak kaydettiysek filtreleme yapacağız
    try:
        # Eğer dataframe yapımız 'perfume_id' sütununa sahipse:
        rec_row = recommendations_df[recommendations_df['perfume_id'] == perfume_id].iloc[0]
        rec_ids = rec_row['recommendations']
        rec_scores = rec_row['scores']
    except IndexError:
        return {"hero": None, "alternatives": []} # Öneri yoksa boş dön
        
    # 4. HERO PICK (En iyi öneri - Listenin 1. sırasındaki)
    hero_id = rec_ids[0]
    hero_score = rec_scores[0]
    hero_data = metadata_df.loc[hero_id]
    
    hero_obj = {
        "id": int(hero_id),
        "name": hero_data['Perfume'],
        "brand": hero_data['Brand'],
        "match_score": int(hero_score * 100), # 0.85 -> 85%
        "vibes": calculate_vibes(hero_data),
        "description": f"Dominant notes of {hero_data['Main Accord 1']}",
        "gender": hero_data['Gender'],
        "rating": float(hero_data['Rating Value']) if hero_data['Rating Value'] else 0.0,
        "url": get_image_url(hero_data['URL'])
    }
    
    # 5. ALTERNATIVES (Geri kalan 4 tanesi)
    alternatives = []
    for i in range(1, 5): # 1'den 5'e kadar (4 adet)
        if i >= len(rec_ids): break
        
        alt_id = rec_ids[i]
        alt_data = metadata_df.loc[alt_id]
        
        alternatives.append({
            "id": int(alt_id),
            "name": alt_data['Perfume'],
            "brand": alt_data['Brand'],
            "match_score": int(rec_scores[i] * 100),
            "vibes": calculate_vibes(alt_data)
        })
        
    return {
        "seed": {
            "name": seed_perfume['Perfume'],
            "brand": seed_perfume['Brand']
        },
        "hero": hero_obj,
        "alternatives": alternatives
    }