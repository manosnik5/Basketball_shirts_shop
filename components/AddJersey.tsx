"use client";

import { useState } from "react";
import Image from "next/image";
import { validateImageFile, validateSKU, validatePrice, validateJerseyNumber, sanitizeString, validateLength } from "@/lib/validation";
import { BRANDS, LEAGUES, POSITIONS, TEAMS } from "@/lib/constants";

const AddJersey = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const maxFiles = 3;
  const maxSizeMB = 5;

  const validateFormData = (formData: FormData): {isValid: boolean, errors: Record<string, string>} => {
    const errors: Record<string, string> = {}

    const playerName = sanitizeString(formData.get("PlayerName") as string)

    if (!validateLength(playerName, 1, 50)) {
      errors.PlayerName = "Player name must be between 1 and 50 characters";
    }

    const jerseyNumber = Number(formData.get("JerseyNumber"));
    const jerseyValidation = validateJerseyNumber(jerseyNumber);
    if (!jerseyValidation.isValid) {
      errors.JerseyNumber = jerseyValidation.error!;
    }

    const jerseyName = sanitizeString(formData.get("jerseyName") as string);
    if (!validateLength(jerseyName, 1, 50)) {
      errors.jerseyName = "Jersey name must be between 1 and 50 characters";
    }

    const description = sanitizeString(formData.get("jerseyDescription") as string);
    if (!validateLength(description, 1, 300)) {
      errors.jerseyDescription = "Description must be between 1 and 300 characters";
    }

    const price = Number(formData.get("price"));
    const priceValidation = validatePrice(price);
    if (!priceValidation.isValid) {
      errors.price = priceValidation.error!;
    }

    const sku = formData.get("sku") as string;
    const skuValidation = validateSKU(sku);
    if (!skuValidation.isValid) {
      errors.sku = skuValidation.error!;
    }

    const position = formData.get("position") as string;
    if (!POSITIONS.includes(position)) {
      errors.position = "Invalid position selected";
    }

    const brand = formData.get("brand") as string;
    if (!BRANDS.includes(brand)) {
      errors.brand = "Invalid brand selected";
    }

    const league = formData.get("league") as string;
    if (!LEAGUES.includes(league)) {
      errors.league = "Invalid league selected";
    }

    const team = formData.get("team") as string;
    if (!TEAMS.includes(team)) {
      errors.team = "Invalid team selected";
    }

    if (previews.length === 0) {
      errors.images = "At least one image is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setError("");

    const formData = new FormData(e.currentTarget);

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError("Please fix the errors below");
      return;
    }

    const data = {
      playerName: sanitizeString(formData.get("PlayerName") as string),
      positionName: formData.get("position") as string,
      jerseyNumber: Number(formData.get("JerseyNumber")),
      name: sanitizeString(formData.get("jerseyName") as string),
      description: sanitizeString(formData.get("jerseyDescription") as string),
      brandName: formData.get("brand") as string,
      leagueName: formData.get("league") as string,
      teamName: formData.get("team") as string,
      basePrice: Number(formData.get("price")),
      sku: sanitizeString(formData.get("sku") as string),
      imageUrls: previews,
    };

    try {
      const res = await fetch("/api/jerseys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Something went wrong");

      alert("Shirt added successfully!");
      setFiles([]);
      setPreviews([]);
      e.currentTarget.reset();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        alert(message);
      }
  };

  const handleFiles = (newFiles: FileList) => {
    setError("");
    const fileArray = Array.from(newFiles);

    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    fileArray.forEach((file) => {
      if (validateImageFile(file)) {
        validFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === validFiles.length) {
            setPreviews([...previews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setFiles([...files, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };
  const removeImage = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="container grid grid-cols-2 gap-4 bg-light-light rounded-lg shadow-shadow-s p-8 pt-20 place-content-center">
      <div className="w-full max-w-4xl mx-auto space-y-6 col-span-2">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"} ${error ? "border-red-500" : ""}`}
        >
          <label className="cursor-pointer">
            <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600">
              Drop images here or <span className="text-blue-500 font-semibold">click to upload</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Maximum {maxFiles} images, {maxSizeMB}MB each
            </p>
          </label>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                </div>
                <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-400 transition cursor-pointer">✕</button>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500 text-center">{files.length} / {maxFiles} images selected</p>
      </div>

      <div className="col-span-2">
        <input name="PlayerName" placeholder="Player Name" className="w-full p-3 border rounded-lg" maxLength={50} required />
        {fieldErrors.PlayerName && <p className="text-sm text-red-500 mt-1">{fieldErrors.PlayerName}</p>}
      </div>

      <div className="col-span-1">
        <select name="position" className="w-full p-3 border rounded-lg" required>
          {POSITIONS.map(position => <option key={position} value={position}>{position}</option>)}
        </select>
        {fieldErrors.position && <p className="text-sm text-red-500 mt-1">{fieldErrors.position}</p>}
      </div>

      <div className="col-span-1">
        <input type="number" name="JerseyNumber" placeholder="Jersey Number" className="w-full p-3 border rounded-lg" min={0} max={100} step="1" required />
        {fieldErrors.JerseyNumber && <p className="text-sm text-red-500 mt-1">{fieldErrors.JerseyNumber}</p>}
      </div>

      <div className="col-span-2">
        <input name="jerseyName" placeholder="Jersey Name" className="w-full p-3 border rounded-lg" maxLength={50} required />
        {fieldErrors.jerseyName && <p className="text-sm text-red-500 mt-1">{fieldErrors.jerseyName}</p>}
      </div>

      <div className="col-span-2">
        <textarea name="jerseyDescription" placeholder="Jersey description" className="w-full p-3 border rounded-lg resize-none" maxLength={300} rows={3} required />
        {fieldErrors.jerseyDescription && <p className="text-sm text-red-500 mt-1">{fieldErrors.jerseyDescription}</p>}
      </div>

      <div className="col-span-1">
        <select name="brand" className="w-full p-3 border rounded-lg" required>
          {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        {fieldErrors.brand && <p className="text-sm text-red-500 mt-1">{fieldErrors.brand}</p>}
      </div>

      <div className="col-span-1">
        <select name="league" className="w-full p-3 border rounded-lg" required>
          {LEAGUES.map(league => <option key={league} value={league}>{league}</option>)}
        </select>
        {fieldErrors.league && <p className="text-sm text-red-500 mt-1">{fieldErrors.league}</p>}
      </div>

      <div className="col-span-1">
        <select name="team" className="w-full p-3 border rounded-lg" required>
          {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
        {fieldErrors.team && <p className="text-sm text-red-500 mt-1">{fieldErrors.team}</p>}
      </div>

      <div className="col-span-1">
        <input type="number" name="price" placeholder="Price (€)" className="w-full p-3 border rounded-lg" min={0} step={0.01} required />
        {fieldErrors.price && <p className="text-sm text-red-500 mt-1">{fieldErrors.price}</p>}
      </div>

      <div className="col-span-2">
        <input name="sku" placeholder="Sku" className="w-full p-3 border rounded-lg" maxLength={15} required />
        {fieldErrors.sku && <p className="text-sm text-red-500 mt-1">{fieldErrors.sku}</p>}
      </div>

      {fieldErrors.images && <p className="text-sm text-red-500 text-center col-span-2">{fieldErrors.images}</p>}

      <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white hover:bg-green-700 px-6 py-4 text-body-medium transition hover:opacity-90 hover:cursor-pointer disabled:opacity-50 mt-5 col-span-2">Add</button>
    </form>
  );
};

export default AddJersey;
