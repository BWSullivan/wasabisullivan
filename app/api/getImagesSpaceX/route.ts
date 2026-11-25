import { albums } from "../../photography";
import { galleryResponse } from "../gallery";

export async function GET() {
  return galleryResponse(albums.spacex);
}
