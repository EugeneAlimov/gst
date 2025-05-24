document.addEventListener('DOMContentLoaded', function() {
    // Находим поля для цветов
    const baseColorField = document.getElementById('id_base_color');
    const hoverColorField = document.getElementById('id_hover_color');
    const textColorField = document.getElementById('id_text_color');
    const generateHoverField = document.getElementById('id_generate_hover');

    if (!baseColorField || !hoverColorField) return;

    // Обновляем предпросмотр при изменении значений
    function updateColorPreview() {
        const baseColor = baseColorField.value;
        const hoverColor = hoverColorField.value;
        const textColor = textColorField ? textColorField.value : '#000000';

        // Находим или создаем элемент предпросмотра
        let previewEl = document.getElementById('color_live_preview');
        if (!previewEl) {
            previewEl = document.createElement('div');
            previewEl.id = 'color_live_preview';
            previewEl.style.marginTop = '10px';
            previewEl.style.marginBottom = '20px';
            previewEl.style.padding = '10px';
            previewEl.style.border = '1px solid #ddd';
            previewEl.style.borderRadius = '4px';
            baseColorField.parentNode.appendChild(previewEl);
        }

        // Обновляем содержимое
        previewEl.innerHTML = `
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <div style="
                    background-color: ${baseColor};
                    width: 100px;
                    height: 50px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${textColor};
                    font-weight: bold;
                ">Основной</div>

                <div style="
                    background-color: ${hoverColor};
                    width: 100px;
                    height: 50px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${textColor};
                    font-weight: bold;
                ">При наведении</div>
            </div>

            <div style="
                background-color: ${baseColor};
                width: 150px;
                height: 40px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${textColor};
                font-weight: bold;
                transition: background-color 0.3s;
            "
            onmouseover="this.style.backgroundColor='${hoverColor}'"
            onmouseout="this.style.backgroundColor='${baseColor}'"
            >Наведите курсор</div>
        `;
    }

    // Генерировать hover-цвет на основе base-цвета
    function generateHoverColor() {
        if (!generateHoverField || !generateHoverField.checked) return;

        // Получаем базовый цвет
        const baseColor = baseColorField.value;
        if (!baseColor) return;

        // Отправляем AJAX-запрос
        const xhr = new XMLHttpRequest();
        const url = '/admin/main/color/generate-hover-color/';
        const data = new FormData();
        data.append('base_color', baseColor);

        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                hoverColorField.value = response.hover_color;
                updateColorPreview();
            }
        };

        xhr.send(data);
    }

    // Получить CSRF-токен из cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Подключаем обработчики событий
    baseColorField.addEventListener('input', updateColorPreview);
    hoverColorField.addEventListener('input', updateColorPreview);
    if (textColorField) {
        textColorField.addEventListener('input', updateColorPreview);
    }

    baseColorField.addEventListener('change', generateHoverColor);
    if (generateHoverField) {
        generateHoverField.addEventListener('change', generateHoverColor);
    }

    // Инициализируем предпросмотр
    updateColorPreview();
});