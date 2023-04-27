import { Component } from "react";
import { AppComponent } from './App.styled';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreBtn } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { fetchData } from '../services';

export class App extends Component {
  state = {
    searchQuery: '',
    hits: [],
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

    if (prevSearchQuery !== nextSearchQuery || prevPage !== nextPage) {
      try {
        this.setState({ isLoading: true });
        const res = await fetchData(nextSearchQuery, nextPage);
          
        const responseHits = res.data.hits;
        if(responseHits.length === 0) {
          alert('Enter another word to search');
          return;
        }
        const filteredData = responseHits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );
        this.setState(prev => ({hits: [...prev.hits, ...res.data.hits],
        showButton: this.state.page < Math.ceil(res.data.totalHits < 12)
        }))
       
      
      } catch (e) {
        console.log(e);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }    

  handleSubmit(searchWord) {
    this.setState({hits: [] , page: 1 ,searchQuery: searchWord.toLowerCase().trim() });
  };

  onLoadMore = () => {

    this.setState(prevState =>({ page: prevState.page + 1 }));
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

