const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const result = document.getElementById("result");
const gallery = document.getElementById("gallery");
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

async function loadImages() {

    try {

        const response = await fetch("http://localhost:5000/images");

        const images = await response.json();

        gallery.innerHTML = "";

        images.reverse().forEach(image => {

            if (image === "test.txt") return;

            const card = document.createElement("div");
            card.className = "image-card";

            const img = document.createElement("img");

            img.src = `http://localhost:5000/uploads/${image}`;
            img.addEventListener("click", () => {

                modal.style.display = "flex";
            
                modalImage.src = img.src;
            
            });

            const deleteBtn = document.createElement("button");

            deleteBtn.innerHTML = "🗑 Delete";

            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", async () => {

                try {

                    await fetch(`http://localhost:5000/delete/${image}`, {
                        method: "DELETE"
                    });

                    loadImages();

                } catch (error) {

                    alert("Delete failed");

                }

            });

            card.appendChild(img);
            card.appendChild(deleteBtn);

            gallery.appendChild(card);

        });

    } catch (error) {

        console.log("Failed to load images");

    }

}

uploadBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];

    if (!file) {

        result.innerText = "Please select an image";
        result.style.color = "red";

        return;

    }

    const formData = new FormData();

    formData.append("image", file);

    try {

        result.innerText = "Uploading...";
        result.style.color = "#ffd000";

        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        result.innerText = data.message;
        result.style.color = "#00ff88";

        loadImages();

    } catch (error) {

        result.innerText = "Upload failed";
        result.style.color = "red";

    }

});

loadImages();

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});