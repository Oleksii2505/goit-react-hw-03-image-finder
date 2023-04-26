import axios from 'axios';

const API_KEY = '34346639-e8efe2ce21a3e54ecceb798ec';
const BASE_URL = 'https://pixabay.com/api/';
const OPTIONS_FOR_RESPONSE =
  'image_type=photo&orientation=horizontal&safesearch=true';


//  export async function fetchData(searchQuery, page) {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&${OPTIONS_FOR_RESPONSE}&per_page=12`
//       );
  
//       const responseHits = res.data.hits;
//       const filteredData = responseHits.map(
//         ({ id, webformatURL, largeImageURL, tags }) => ({
//           id,
//           webformatURL,
//           largeImageURL,
//           tags,
//         })
//       );
  
//       return filteredData;
//     } catch (e) {
//       console.log(e);
//     }
//   }

  export const fetchData = async (searchQuery, page) => {
    const response = await axios.get(`${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&${OPTIONS_FOR_RESPONSE}&per_page=12`);
    return response.data
  }



