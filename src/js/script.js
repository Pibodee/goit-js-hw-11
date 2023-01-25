import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  loadMore: document.querySelector('.load-more'),
};
const gallery = document.querySelector('.gallery');

let page = 1;
let shown = 0;

refs.loadMore.style.display = 'none';

refs.form.addEventListener('submit', onSubmit);
// refs.loadMore.addEventListener('click', load)

function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';

  const name = refs.input.value.trim();
  if (!name) {
    refs.loadMore.style.display = 'none';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    getImages(name);
  }
}

// function load(){}

async function getImages(name) {
  const API_URL = 'https://pixabay.com/api/';
  const KEY = '33095409-60cba74fa568b59265daa29f1';
  const IMAGES_PER_PAGE = 40;

  try {
    const resp = await axios(
      `${API_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${IMAGES_PER_PAGE}`
    );
    shown += resp.data.hits.length;
    console.log(resp);
    createMarkup(resp.data);
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(array) {
    const markup = array.hits.map(
        item => {
            
      }
  );
}
