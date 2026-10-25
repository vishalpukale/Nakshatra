import { useEffect, useState } from "react";
import { fetchManagedGallery, removeGalleryImage, saveGalleryImage, updateGalleryImage } from "../../../services/adminApi";
import { apiUrl } from "../../../services/apiBase";

const fieldClass = "mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-white";

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [placement, setPlacement] = useState("gallery");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const body = await fetchManagedGallery();
    setImages(body.data || []);
  };

  useEffect(() => {
    load().catch((loadError) => setError(loadError.message));
  }, []);

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    setMessage("");
    const formData = new FormData();
    formData.append("placement", placement);
    formData.append("caption", caption);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (file) formData.append("image", file);
    try {
      await saveGalleryImage(formData);
      setCaption("");
      setImageUrl("");
      setFile(null);
      setMessage("Image saved. Refresh the public site to see it.");
      await load();
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const toggle = async (image) => {
    await updateGalleryImage(image.id, {
      caption: image.caption,
      placement: image.placement,
      sortOrder: image.sortOrder,
      isActive: !image.isActive,
    });
    await load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Gallery</h1>
      <p className="mb-6 mt-1 text-sm text-white/60">
        Hero images replace the home banner. Gallery images replace the photo grid. Until you add some, the site keeps its current pictures.
      </p>
      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {message ? <p className="mb-4 text-green-400">{message}</p> : null}

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-xl border border-white/10 p-4 md:grid-cols-2">
        <label className="text-sm">
          Shows on
          <select className={fieldClass} value={placement} onChange={(input) => setPlacement(input.target.value)}>
            <option value="hero">Home banner</option>
            <option value="gallery">Gallery grid</option>
          </select>
        </label>
        <label className="text-sm">
          Caption
          <input className={fieldClass} value={caption} onChange={(input) => setCaption(input.target.value)} />
        </label>
        <label className="text-sm">
          Image address
          <input className={fieldClass} value={imageUrl} onChange={(input) => setImageUrl(input.target.value)} placeholder="https://..." />
        </label>
        <label className="text-sm">
          Or upload a file
          <input className={fieldClass} type="file" accept="image/*" onChange={(input) => setFile(input.target.files?.[0] || null)} />
        </label>
        <button type="submit" className="rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 md:col-span-2 md:w-fit">
          Add image
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-xl border border-white/10">
            <img src={apiUrl(image.imageUrl)} alt={image.caption || ""} className="h-40 w-full object-cover" />
            <div className="space-y-2 p-3 text-sm">
              <p>{image.caption || "No caption"}</p>
              <p className="text-white/50">{image.placement === "hero" ? "Home banner" : "Gallery"}{image.isActive ? "" : " · Hidden"}</p>
              <div className="flex gap-2">
                <button type="button" className="rounded-md border border-white/20 px-3 py-1" onClick={() => toggle(image)}>
                  {image.isActive ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  className="rounded-md border border-white/20 px-3 py-1"
                  onClick={async () => {
                    await removeGalleryImage(image.id);
                    await load();
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;
