import axios from 'axios';

const API_KEY = '34346639-e8efe2ce21a3e54ecceb798ec';
const BASE_URL = 'https://pixabay.com/api/';
const OPTIONS_FOR_RESPONSE =
  'image_type=photo&orientation=horizontal&safesearch=true';

  export const fetchData = async (searchQuery, page) => {
    const {data} = await axios.get(`${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&${OPTIONS_FOR_RESPONSE}&per_page=12`);
    return data
  }



