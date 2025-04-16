import { open } from '@tauri-apps/plugin-dialog';

/**
 * Using Tauri dialog plugin to open a file dialog and select a folder
 * @returns Selected path
 */
export async function chooseUnityFolder(): Promise<string | null> {
  const selected = await open({
    directory: true,
    multiple: false,
    title: "Choose your Unity project folder",
  });

  if (typeof selected === "string") {
    return selected;
  }

  return null;
}
