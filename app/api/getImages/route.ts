import { albums } from "../../photography";
import { galleryResponse } from "../gallery";

export function GET() {
  return galleryResponse(albums.japan.prefix);
}
