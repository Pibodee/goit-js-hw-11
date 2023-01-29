import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './js/api';

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
  page = 1;
  shown = 0;

  const name = refs.input.value.trim();
  if (!name) {
    refs.loadMore.style.display = 'none';
  } else {
    getImages(name).then(resp => {
      shown += resp.hits.length;
      if (resp.hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createMarkup(resp);
        refs.loadMore.style.display = 'flex';
        Notiflix.Notify.info(`Hooray! We found ${resp.totalHits} images.`);
        if (resp.hits.length < 40) {
          refs.loadMore.style.display = 'none';
          return Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results"
          );
        }
      }
    });
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
  getImages(name, page).then(resp => {
    shown += resp.hits.length;
    createMarkup(resp);
    if (shown >= resp.totalHits) {
      refs.loadMore.style.display = 'none';
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
    }
  });
}

const simpleLightBox = new simpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
