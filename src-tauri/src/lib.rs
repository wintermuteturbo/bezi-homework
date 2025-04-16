// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn save_unity_script_at_path(
    script_code: String,
    file_name: String,
    unity_path: String,
) -> Result<String, String> {
    use std::fs;
    use std::path::Path;

    let full_path = Path::new(&unity_path)
        .join("Assets/Generated")
        .join(file_name);
    fs::create_dir_all(full_path.parent().unwrap()).map_err(|e| e.to_string())?;
    fs::write(&full_path, script_code).map_err(|e| e.to_string())?;

    Ok(format!("Saved to {}", full_path.display()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![save_unity_script_at_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
