import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const KEY = '33095409-60cba74fa568b59265daa29f1';
const IMAGES_PER_PAGE = 40;
export const getImages = async (name, page) => {
  return await axios.get(
    `${API_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${IMAGES_PER_PAGE}`
  ).then(resp => resp.data)
}

