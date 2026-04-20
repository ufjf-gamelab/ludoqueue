import { useEffect, useState, type ChangeEvent } from "react";
import type { RecipeType } from "../../EntitiesTypes";
import { useGame } from "../../../Provider";
import { recipe1, recipe2 } from "./recipes";
import "./RecipeChanger.css";

export type GameActionChangeRecipe = {
  type: "change game recipe";
  recipe: RecipeType;
};

export function isRecipe(obj: unknown): obj is RecipeType {
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

export default function RecipeChanger() {
  const { game, dispatch } = useGame()!;
  const [savedRecipes, setSavedRecipes] = useState<RecipeType[]>([]);
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
    } catch {
      alert("Não foi possível carregar receitas do localStorage.");
    }
  }, []);

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
        localStorage.setItem("recipes", JSON.stringify(nextRecipes));
        setSavedRecipes(nextRecipes);
        alert(`Recipe importada e salva como: ${name}`);
      } catch (e) {
        alert("Erro ao ler o arquivo: " + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="recipe-changer-container">
      <label className="recipe-label">
        <span>Saved recipes:</span>
        <select
          value={game.recipe.name}
          onChange={(e) => {
            switch (e.target.value) {
              case "recipe1":
                dispatch({ type: "change game recipe", recipe: recipe1 });
                break;
              case "recipe2":
                dispatch({ type: "change game recipe", recipe: recipe2 });
                break;

              default: {
                const recipe = savedRecipes.find(
                  (recipe) => recipe.name === e.target.value,
                );
                if (recipe) {
                  dispatch({ type: "change game recipe", recipe });
                }
              }
            }
          }}
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
      <label className="file-button">
        Importar arquivo
        <input type="file" accept=".json" onChange={importFile} hidden />
      </label>
    </div>
  );
}
