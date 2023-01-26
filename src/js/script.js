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
refs.loadMore.addEventListener('click', load);
refs.form.addEventListener('input', onInput);

function onInput() {
  refs.loadMore.style.display = 'none';
}

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
    refs.loadMore.style.display = 'flex';
  }
}

async function getImages(name, page) {
  const API_URL = 'https://pixabay.com/api/';
  const KEY = '33095409-60cba74fa568b59265daa29f1';
  const IMAGES_PER_PAGE = 40;

  try {
    const resp = await axios(
      `${API_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${IMAGES_PER_PAGE}`
    );
    shown += resp.data.hits.length;
    refs.loadMore.style.display = 'block';
    createMarkup(resp.data);
    message(page, resp.data.totalHits, shown);
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(array) {
  const markup = array.hits
    .map(item => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = item;
      return `<a class = "photo-link" href="${largeImageURL}">
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

function load() {
  const name = refs.input.value.trim();
  page += 1;
  getImages(name, page);
}

const simpleLightBox = new simpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function message(page, totalHits, shown) {
  if (page === 1) {
    return;
  }
  if (page >= 2) {
    if (shown === totalHits) {
      refs.loadMore.style.display = 'none';
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
    }
    return Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  }
}
