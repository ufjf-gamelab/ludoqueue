import { useEffect, useState, type ChangeEvent } from "react";
import type { RecipeType } from "../../EntitiesTypes";

export default function RecipeChanger() {
  // recipes saved in localStorage under key 'recipes'
  const [savedRecipes, setSavedRecipes] = useState<RecipeType[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [selectedSavedRecipe, setSelectedSavedRecipe] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("recipes");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const recipes = Array.isArray(parsed)
        ? parsed
        : isRecipe(parsed)
          ? [parsed]
          : null;

      if (!recipes || !recipes.every(isRecipe)) {
        alert("Receitas inválidas encontradas");
        return;
      }

      setSavedRecipes(recipes as RecipeType[]);
      if (recipes.length > 0) {
        setSelectedSavedRecipe(recipes[0].name);
      }
    } catch {
      alert("Não foi possível carregar receitas do localStorage.");
    }
  }, []);

  const isRecipe = (obj: unknown): obj is RecipeType => {
    if (!obj || typeof obj !== "object") return false;
    const o = obj as Record<string, unknown>;
    if (
      typeof o.name !== "string" ||
      !Array.isArray(o.input) ||
      !Array.isArray(o.output)
    )
      return false;
    const checkArr = (arr: unknown) =>
      Array.isArray(arr) &&
      arr.every((it: unknown) => {
        if (!Array.isArray(it) || it.length !== 2) return false;
        const [k, v] = it as [unknown, unknown];
        const okKey = k === "red" || k === "blue" || k === "green"; //verifica se e goodtype, ver se da pra mudar
        const okVal = typeof v === "number";
        return okKey && okVal;
      });
    return checkArr(o.input) && checkArr(o.output);
  };

  const importFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const candidate = parsed.recipe ?? parsed;
        if (!isRecipe(candidate)) {
          alert("O arquivo não contém um RecipeType válido.");
          return;
        }
        const recipeToSave = candidate as RecipeType;
        const name = recipeToSave.name;
        const nextRecipes = [...savedRecipes, recipeToSave];
        setFileName(name);
        localStorage.setItem("recipes", JSON.stringify(nextRecipes));
        setSavedRecipes(nextRecipes);
        setSelectedSavedRecipe(name);
        alert(`Recipe importada e salva como: ${name}`);
      } catch (e) {
        alert("Erro ao ler o arquivo: " + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>Saved recipes:</span>
        <select
          value={selectedSavedRecipe}
          onChange={(e) => setSelectedSavedRecipe(e.target.value)}
        >
          <option value="recipe1">Recipe 1</option>
          <option value="recipe2">Recipe 2</option>
          {savedRecipes.map((recipe) => (
            <option key={recipe.name} value={recipe.name}>
              {recipe.name}
            </option>
          ))}
        </select>
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input type="file" accept=".json" onChange={importFile} />
        <p>Arquivo: {fileName ? fileName : "Faça upload"}</p>
      </div>
    </div>
  );
}
