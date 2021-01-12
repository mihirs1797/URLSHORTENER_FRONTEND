

async function getUrlsFromServer(){
    let response = await fetch('http://localhost:5000');

    let spinner  = createSpinner();

    document.getElementById('table').appendChild(spinner);

    let urls = await response.json();

    document.getElementById('table').removeChild(spinner);

    return urls;
}

function createSpinner(){
    let spinner = document.createElement('div');
    spinner.className = "spinner-border text-success text-center"
    spinner.style = "width: 3rem; height: 3rem;"
    spinner.setAttribute('role', 'status');
    spinner.innerHTML =    `<span class="sr-only">Loading...</span>`;
    return spinner;
}

async function renderTable(){
    document.getElementById('error').innerText = '';
    let tbody = document.getElementById('tbody');

    let urls = await getUrlsFromServer();

    tbody.innerHTML = `${
                            urls.map((url)=>{
                               return `<tr>
                                            <td><a href="${url.url}" target="_blank">${url.url}</a></td>
                                            <td>    
                                                <a href="http://localhost:5000/${url.short}" target="_blank">${url.short}</a>
                                                <button class="btn btn-sm ml-1 btn-outline-secondary" onclick="copyText('${url.short}')"><i class="fa fa-clone"></i></button>
                                            </td>
                                            <td>${url.clicks}</td>
                                        </tr>`;
                            }).join('')
                        }`;
}

function copyText(short){
    let helpInput = document.createElement('input');
    helpInput.classList.add('d-hidden');
    helpInput.style.position = 'fixed';
    helpInput.style.top = 0;
    helpInput.style.left = 0;
    document.body.appendChild(helpInput);
    helpInput.value = `http://localhost:5000/${short}`;
    console.log(helpInput.value);
    helpInput.focus();
    helpInput.select();
    document.execCommand('copy');
    helpInput.remove();
}


renderTable();


document.getElementById('form').onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById('error').innerText = '';
    let inputUrl = e.target.url.value;
    let urlencoded = new URLSearchParams();
    document.getElementById('url').value = '';
    urlencoded.append('url', inputUrl);
    let res = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlencoded
    });

    let response = await res.json();
    if(response.error){
        document.getElementById('error').innerText = response.error;
    }else{
        renderTable();
    }
}