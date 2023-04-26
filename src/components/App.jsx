import { Component } from "react";
import { AppComponent } from './App.styled';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreBtn } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { fetchData } from '../services';

// import axios from 'axios';

// const API_KEY = '34346639-e8efe2ce21a3e54ecceb798ec';
// const BASE_URL = 'https://pixabay.com/api/';
// const OPTIONS_FOR_RESPONSE =
//   'image_type=photo&orientation=horizontal&safesearch=true';

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
          this.setState({hits: []})
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
       
        if (filteredData.length === 0) {
           this.setState(prevState => ({
          hits: [...prevState.hits]
      }));
          alert('Enter another word to search');
          return;
        }

        if (filteredData.length <= 12) {
          this.setState({
            hits: filteredData,
            isLoading: false,
            showButton: false,
            buttonLoading: false,
          });
        }

        // this.setState({
        //   hits: filteredData,
        //   isLoading: false,
        //   showButton: true,
        //   buttonLoading: false,
        // });
      } catch (e) {
        console.log(e);
      }
    }
  }    

    // if (prevPage !== nextPage) {
    //   try {
    //     if (nextPage === 1) {
    //       return;
    //     }
    //     this.setState({ buttonLoading: true });
    //     const res = await fetchData(nextSearchQuery, nextPage)
          
    //     const responceHits = res.data.hits;
    //     const filteredData = responceHits.map(
    //       ({ id, largeImageURL, webformatURL }) => ({
    //         id,
    //         largeImageURL,
    //         webformatURL,
    //       })
    //     );
    //     const updatedHits = [...this.state.hits, ...filteredData];

    //     if (filteredData.length < 12) {
    //       this.setState({
    //         hits: updatedHits,
    //         showButton: false,
    //         isLoading: false,
    //       });
    //       return;
    //     }
    //     this.setState({
    //       hits: updatedHits,
    //       isLoading: false,
    //       showButton: true,
    //       buttonLoading: false,
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  // };

  // async componentDidUpdate(prevProps, prevState) {

  //   const {searchQuery} = this.props;
  //   const {page} = this.state;
   
  //  if (prevProps.searchQuery !== searchQuery) {

  //    this.setState({page: 1, status: "pending"});
  //    try {
  //       const response = await fetchData(searchQuery, 1);

  //       if (response.totalHits === 0) {
  //           this.setState({status: "rejected", error: `Sorry, there are no images ${searchQuery}. Please try again.`})
  //         } else {
  //           this.setState({images: response.hits, status: "resolved"}); 
  //           if (response.totalHits <= 12) {
  //               this.setState({isLoadButton: false});
  //             } else {
  //               this.setState({isLoadButton: true});
  //             }
  //         }  

  //    } catch (error) {
  //       this.setState({error: error.message, status: "rejected"});
  //    }
     
  //  } else if (prevState.page !== page && page !== 1) {

  //       try {
  //          const response = await fetchData(searchQuery, page);
  //          this.setState(prevState => ({
  //           images: [...prevState.images, ...response.hits], status: "resolved"
  //       })); 
  //       if (Math.ceil(response.totalHits / 12) === page) {
  //           this.setState({isLoadButton: false});
  //         } else {
  //           this.setState({isLoadButton: true});
  //         } 
          
  //       } catch (error) {
  //           this.setState({error: error.message, status: "rejected"});
  //        }
  //   }

 
  // }

  handleSubmit(searchWord) {
    this.setState({hits: [] , page: 1 ,searchQuery: searchWord.toLowerCase().trim() });
  };

  onLoadMore = () => {
    const prevPage = this.prevState.page + 1;
    this.setState({ page: prevPage });
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

