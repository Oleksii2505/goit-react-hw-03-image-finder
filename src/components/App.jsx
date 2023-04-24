import { Component } from "react";
import { AppComponent } from './App.styled';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreBtn } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';

import axios from 'axios';

const API_KEY = '34346639-e8efe2ce21a3e54ecceb798ec';
const BASE_URL = 'https://pixabay.com/api/';
const OPTIONS_FOR_RESPONSE =
  'image_type=photo&orientation=horizontal&safesearch=true';

export class App extends Component {
  state = {
    searchQuery: '',
    hits: null,
    page: 1,
    isLoading: false,
    buttonLoading: false,
    showButton: false,
    showModal: false,
    largeImage: '',
  }

  async componentDidUpdate(prevProps, prevState) {
    const prevSearchQuery = prevState.searchQuery;
    const nextSearchQuery = this.state.searchQuery;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevSearchQuery !== nextSearchQuery) {
      try {
        this.setState({ hits: null, page: 1, isLoading: true });
        const res = await axios.get(
          `${BASE_URL}?q=${nextSearchQuery}&page=1&key=${API_KEY}&${OPTIONS_FOR_RESPONSE}&per_page=12`
        );

        const responseHits = res.data.hits;
        const filteredData = responseHits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );
        if (filteredData.length === 0) {
          this.setState({
            isLoading: false,
            hits: filteredData,
            showButton: false,
            buttonLoading: false,
          });
          alert('Enter another word to search');
          return;
        }

        if (filteredData.length < 12) {
          this.setState({
            hits: filteredData,
            isLoading: false,
            showButton: false,
            buttonLoading: false,
          });
          return;
        }

        this.setState({
          hits: filteredData,
          isLoading: false,
          showButton: true,
          buttonLoading: false,
        });
      } catch (e) {
        console.log(e);
      }
    }

    if (prevPage !== nextPage) {
      try {
        if (nextPage === 1) {
          return;
        }
        this.setState({ buttonLoading: true });
        const res = await axios.get(
          `${BASE_URL}?q=${nextSearchQuery}&page=${nextPage}&key=${API_KEY}&${OPTIONS_FOR_RESPONSE}&per_page=12`
        );
        const responceHits = res.data.hits;
        const filteredData = responceHits.map(
          ({ id, largeImageURL, webformatURL }) => ({
            id,
            largeImageURL,
            webformatURL,
          })
        );
        const updatedHits = [...this.state.hits, ...filteredData];

        if (filteredData.length < 12) {
          this.setState({
            hits: updatedHits,
            showButton: false,
            isLoading: false,
          });
          return;
        }
        this.setState({
          hits: updatedHits,
          isLoading: false,
          showButton: true,
          buttonLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  handleSubmit(searchWord) {
    this.setState({ searchQuery: searchWord.toLowerCase().trim() });
  };

  onLoadMore = () => {
    const nextPage = this.state.page + 1;
    this.setState({ page: nextPage });
  };

  showModal = image => {
    this.setState({ largeImage: image, showModal: true });
  };

  closeModal = () => {
    this.setState({ largeImage: '', showModal: false });
  };

  render() {
    const { hits, isLoading, showButton, showModal, largeImage } = this.state;
    return (
      <AppComponent>
        <SearchBar onSubmit={this.handleSubmit.bind(this)} />
        <ImageGallery hits={hits} showModal={this.showModal} />
        {isLoading && <Loader />}
        {showButton && <LoadMoreBtn onClick={this.onLoadMore} />}
        {showModal && (
          <Modal closeModal={this.closeModal} largeImage={largeImage} />
        )}
      </AppComponent>
    );
  }
}

