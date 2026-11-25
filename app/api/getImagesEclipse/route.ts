import { albums } from "../../photography";
import { galleryResponse } from "../gallery";

export function GET() {
  return galleryResponse(albums.eclipse);
}
