export default function RecipeChanger(){
      // recipes saved in localStorage under key 'recipes'
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipes>({});
  const [selectedSavedRecipe, setSelectedSavedRecipe] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("recipes");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedRecipes;
        setSavedRecipes(parsed);
        const keys = Object.keys(parsed);
        if (keys.length > 0) setSelectedSavedRecipe(keys[0]);
      } catch (e) {
        // ignore malformed
        console.warn("Invalid recipes in localStorage", e);
      }
    }
  }, []);

  const isRecipe = (obj: unknown): obj is RecipeType => {
    if (!obj || typeof obj !== "object") return false;
    const o = obj as Record<string, unknown>;
    if (!Array.isArray(o.input) || !Array.isArray(o.output)) return false;
    const checkArr = (arr: unknown) =>
      Array.isArray(arr) &&
      arr.every((it: unknown) => {
        if (!Array.isArray(it) || it.length !== 2) return false;
        const [k, v] = it as [unknown, unknown];
        const okKey = k === "red" || k === "blue" || k === "green";
        const okVal = typeof v === "number";
        return okKey && okVal;
      });
    return checkArr(o.input) && checkArr(o.output);
  };

  const importFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const parsed = JSON.parse(text);
        // If the JSON itself is an object with a 'recipe' property, allow that
        const candidate = parsed.recipe ?? parsed;
        if (!isRecipe(candidate)) {
          alert("O arquivo não contém um RecipeType válido.");
          return;
        }
        // ask for a name to save under
        const defaultName = (parsed.name as string) || file.name.replace(/\.[^.]+$/, "");
        const name = window.prompt("Nome para salvar a recipe:", defaultName) || defaultName;
        const current = { ...savedRecipes } as SavedRecipes;
        current[name] = candidate;
        localStorage.setItem("recipes", JSON.stringify(current));
        setSavedRecipes(current);
        setSelectedSavedRecipe(name);
        alert(`Recipe importada e salva como: ${name}`);
      } catch (e) {
        alert("Erro ao ler o arquivo: " + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) importFile(f);
    // clear input so same file can be reselected if needed
    if (fileRef.current) fileRef.current.value = "";
  };

  const applySavedRecipe = () => {
    if (!selectedSavedRecipe) return;
    const recipe = savedRecipes[selectedSavedRecipe];
    if (!recipe) return;
    // dispatch editor change recipe - reducer checks editor type is exchanger
    dispatch({ type: "editor change recipe", recipe: recipe, name: selectedSavedRecipe });
  };

    return (
    
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Saved recipes:</span>
          <select value={selectedSavedRecipe} onChange={(e) => setSelectedSavedRecipe(e.target.value)}>
            <option value="recipe1">Recipe 1</option>
            {Object.keys(savedRecipes).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <button onClick={applySavedRecipe} disabled={!selectedSavedRecipe}>
          Apply recipe to editor
        </button>
      </div>
  );
}
