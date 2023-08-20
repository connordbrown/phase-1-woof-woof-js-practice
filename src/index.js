document.addEventListener('DOMContentLoaded', () => {
    fetchData();
  });
  
  
    function fetchData() {
      fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(data => {
          // display dogBar when page loads
          createDog(data);
          const filterBtn = document.querySelector('#good-dog-filter');
          
          // filter dogs based on isGoodDog value
          filterBtn.addEventListener('click', () => {
            // clear out dogBar and dogInfo before filtering
            const dogBar = document.querySelector('#dog-bar');
            dogBar.textContent = "";
            const dogInfo = document.querySelector('#dog-info');
            dogInfo.textContent = "";
            if (filterBtn.textContent === 'Filter good dogs: OFF') {
              filterBtn.textContent = 'Filter good dogs: ON';
              const filteredData = data.filter(dog => dog.isGoodDog === true);
              createDog(filteredData);
            } else {
              filterBtn.textContent = 'Filter good dogs: OFF';
              createDog(data);
            }
          })
        })
      }
  
    function createDog(dogData) {
      dogData.forEach(dog => {
        const dogBar = document.querySelector('#dog-bar');
        const dogSpan = document.createElement('span');
        dogSpan.textContent = dog.name;
        dogBar.appendChild(dogSpan);
  
        // display dog data
        dogSpan.addEventListener('click', () => {
          const dogInfo = document.querySelector('#dog-info');
          const { image, name, isGoodDog, id } = dog;
  
          const dogImg = document.createElement('img');
          dogImg.src = image;
          const dogName = document.createElement('h2');
          dogName.textContent = name;
          const goodBadDog = document.createElement('button');
          if (isGoodDog) {
            goodBadDog.textContent = "Good Dog!";
          } else {
            goodBadDog.textContent = "Bad Dog!";
          }

          // update dog isGoodDog in DOM and server
          goodBadDog.addEventListener('click', () => {
            let good = true;
            if (goodBadDog.textContent === "Good Dog!") {
              goodBadDog.textContent = "Bad Dog!";
              good = false;
              // update in DOM data
              dog.isGoodDog = false;
            } else {
              goodBadDog.textContent = "Good Dog!";
              good = true;
              // update in DOM data
              dog.isGoodDog = true;
            }
            
            // update server with new isGoodDog status
            const updateObj = {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({ "isGoodDog": good })
            }
            fetch(`http://localhost:3000/pups/${id}`, updateObj)
              .catch(error => alert(error.message))
          });
          // append elements to dogInfo
          dogInfo.appendChild(dogImg);
          dogInfo.appendChild(dogName);
          dogInfo.appendChild(goodBadDog);
        });
      });
    }
  