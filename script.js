let model_buffer = null;
let image_buffer = null;

let wrappers_text_reference = [];
let image_buffer_list = [];

let yolo_classes = [];

let file_model = document.querySelector('#file-model');
let file_image = document.querySelector('#file-image');
let folderInput = document.querySelector('#folder-input');
let class_labels = document.querySelector('#class-label');

let file_model_duplicate = document.querySelector('#file-model-duplicate');
let file_image_duplicate = document.querySelector('#file-image-duplicate');
let folderInput_duplicate = document.querySelector('#folder-input-duplicate');
let class_labels_duplicate = document.querySelector('#class-label-duplicate');

let btn_detect = document.querySelector('#btn-detect');

let lbl_cls = document.querySelector('#lbl-cls');
let img_preview = document.getElementById('preview_image');
let result_box = document.querySelector('#resultBox');

function createWrapper(file){
    let wrapper = document.createElement('div');
    wrapper.style.maxWidth = '300px';
    wrapper.style.width = '240px';
    wrapper.style.maxHeight = '100px';
    wrapper.style.margin = '10px';
    wrapper.style.outline = '3px solid black';
    wrapper.className = 'wrapper';
    let wrapper_image = document.createElement('img');
    wrapper_image.id = 'wrapper_image';
    wrapper_image.src = URL.createObjectURL(file);
    wrapper_image.style.maxWidth = '64px';
    wrapper_image.style.maxHeight = '64px';
    wrapper_image.style.minHeight = '30px';
    wrapper_image.style.minWidth = '30px';
    wrapper.style.backgroundColor = '#415b40';
        
    let wrapper_text_box = document.createElement('div');
    let wrapper_text_file_name = document.createElement('span');
    wrapper_text_file_name.style.padding = '5px';
    wrapper_text_file_name.id = 'file_name';
    wrapper_text_file_name.innerText = file.name.substring(0, 20);

    let wrapper_text_result = document.createElement('span');
    wrapper_text_result.id = 'resultText';
        

    wrapper.appendChild(wrapper_image);
    wrapper.appendChild(wrapper_text_box);
    wrapper_text_box.appendChild(wrapper_text_file_name);
    wrapper_text_box.appendChild(wrapper_text_result);

    wrappers_text_reference.push(wrapper_text_result);//armazena a referencia do texto do resultado

    result_box.appendChild(wrapper);
}

function disableButtons(){
    file_model.disabled = true;
    file_image.disabled = true;
    folderInput.disabled = true;
    class_labels.disabled = true;
    btn_detect.disabled = true;
    file_model_duplicate.disabled = true;
    file_image_duplicate.disabled = true;
    folderInput_duplicate.disabled = true;
    class_labels_duplicate.disabled = true;
}

function enableButtons(){
    file_model.disabled = false;
    file_image.disabled = false;
    folderInput.disabled = false;
    class_labels.disabled = false;
    btn_detect.disabled = false;
    file_model_duplicate.disabled = false;
    file_image_duplicate.disabled = false;
    folderInput_duplicate.disabled = false;
    class_labels_duplicate.disabled = false;
}

function handleFileModelChange(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            model_buffer = event.target.result;
        });
        reader.readAsArrayBuffer(file);
    }
}

file_model.addEventListener('change', handleFileModelChange);
file_model_duplicate.addEventListener('change', handleFileModelChange);

function eraseFillerMessage(){
    let filler_text = document.getElementById('filler-message');
    if(filler_text){
        filler_text.remove()    
    }
}

function handleFileImageChange(event) {
    const file = event.target.files[0];
    if(file && file.type.startsWith('image/')) {
        eraseFillerMessage();
        image_buffer_list.push(file);
        img_preview.src = URL.createObjectURL(file);
        img_preview.style.maxWidth = '640px';
        img_preview.style.maxHeight = '640px';
        img_preview.style.minHeight = '300px';
        img_preview.style.minWidth = '300px';
        createWrapper(file);
    }
    else{
        alert('Selecione um arquivo com formato válido de imagem.');
    }
}

file_image.addEventListener('change', handleFileImageChange);
file_image_duplicate.addEventListener('change', handleFileImageChange);

function handleFolderInputChange(event) {
    const files = event.target.files;
    var hasPreviewImage = false;
    eraseFillerMessage();
    if(event.target.files.length > 250){
        alert('Selecione uma pasta contendo, no máximo, 250 arquivos.');
        return;
    }
    for(let i = 0; i < 250; i++) { // máximo de 250 imagens no diretório
        const file = files[i];
        if(file && file.type.startsWith('image/')) {
            if(hasPreviewImage==false){
                img_preview.src = URL.createObjectURL(file);
                img_preview.style.maxWidth = '640px';
                img_preview.style.maxHeight = '640px';
                img_preview.style.minHeight = '300px';
                img_preview.style.minWidth = '300px';
                hasPreviewImage = true;
            }
            createWrapper(file)
            image_buffer_list.push(file);
        }
    }
}

folderInput.addEventListener('change', handleFolderInputChange);
folderInput_duplicate.addEventListener('change', handleFolderInputChange);

function handleClassLabelChange(event) {
    const file = event.target.files[0];
    if(file) {
        if (!file.name.endsWith('.json')) {
            alert('Please select a .json file.');
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const jsonData = JSON.parse(event.target.result);
            if (!jsonData || Object.keys(jsonData).length === 0) {
                alert('The selected file is empty or does not contain valid JSON data.');
                return;
            }
            console.log(jsonData);
            yolo_classes = jsonData;
        });
        reader.onerror = () => {
            alert('An error occurred while reading the file.');
        };
        reader.readAsText(file);
    } else {
        alert('No file selected.');
    }
}

class_labels.addEventListener('change', handleClassLabelChange);
class_labels_duplicate.addEventListener('change', handleClassLabelChange);


btn_detect.addEventListener('click', async (event) => {
    try {
        if (image_buffer_list.length > 0 && model_buffer){
            disableButtons();
            const batch_size = 32;
            while(image_buffer_list.length > 0) {
                var batch = [];
                var textBatch = [];
                if(image_buffer_list.length < batch_size){
                    let length = image_buffer_list.length;
                    batch = image_buffer_list.splice(0, length);
                    textBatch = wrappers_text_reference.splice(0, length);
                } else {
                    batch = image_buffer_list.splice(0, batch_size);
                    textBatch = wrappers_text_reference.splice(0, batch_size);
                }
                for(let i = 0; i < batch.length; i++) {
                    await predict(batch[i], textBatch[i]);
                }
            }
            enableButtons();
        } else {
            if(!model_buffer && !image_buffer_list.length === 0) {
                alert('Selecione um modelo e uma imagem.')
            } else if(image_buffer_list.length === 0) {
                alert('Selecione uma imagem ou pasta contendo imagens.')
            } else if(!model_buffer) {
                alert('Selecione um modelo em formato .onnx.')
            } else {
                alert('Selecione um modelo em formato .onnx.')
            }
        }
    } catch (e) {
        console.error(e);
        alert('Um erro ocorreu: ' + e.message);
        enableButtons();
    }
});

const predict = async (file, resultText) => {
    const [arr, width, height] = await prepare(file);
    const output = await run_model(arr);
    const [cls, max_conf] = process_output(output);
    resultText.innerText = cls ? `${cls} (${max_conf.toFixed(2)})` : 'No detection';
};

const prepare = async (file) => {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const [width, height] = [img.width, img.height];
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 640;
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, 640, 640);
            const img_data = context.getImageData(0, 0, 640, 640);
            const pixels = img_data.data;
            const red = [];
            const green = [];
            const blue = [];
            for(let i=0; i<pixels.length; i+=4) {
                red.push(pixels[i] / 255.0);
                green.push(pixels[i + 1] / 255.0);
                blue.push(pixels[i + 2] / 255.0);
            }
            const arr = new Float32Array([...red, ...green, ...blue]);
            resolve([arr, width, height]);
        };
        img.src = URL.createObjectURL(file);
    });
};

const run_model = async (input) => {
    const model = await ort.InferenceSession.create(model_buffer);
    const tensor = new ort.Tensor('float32', input, [1, 3, 640, 640]);
    const outputMap = await model.run({images: tensor});
    const output = outputMap.output0.data;
    return output;
};

const process_output = (output) => {
    console.log('Output:', output);

    const max_conf = Math.max(...output);
    const max_index = output.indexOf(max_conf);

    const cls = max_conf > 0.3 ? yolo_classes[max_index] : null;

    console.log('Final Class:', cls, 'Max Confidence:', max_conf);
    return [cls, max_conf];
};
