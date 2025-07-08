// Gallery data with category-specific images
const galleryItems = [
  // Nature images
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    alt: "Forest Path",
    category: "nature",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Mountain Lake",
    category: "nature",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
    alt: "Sunset Valley",
    category: "nature",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
    alt: "Ocean Waves",
    category: "nature",
  },

  // City images
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    alt: "City Skyline",
    category: "city",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=300&fit=crop",
    alt: "Urban Street",
    category: "city",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop",
    alt: "Night City",
    category: "city",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
    alt: "City Architecture",
    category: "city",
  },

  // Animal images
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
    alt: "Lion Portrait",
    category: "animals",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    alt: "Elephant Family",
    category: "animals",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop",
    alt: "Colorful Bird",
    category: "animals",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop",
    alt: "Wolf in Nature",
    category: "animals",
  },
]

// Gallery state
let currentFilter = "all"
let currentPage = 0
let filteredItems = [...galleryItems]
let currentLightboxIndex = null
const itemsPerPage = 6

// DOM elements
const galleryGrid = document.getElementById("galleryGrid")
const filterButtons = document.querySelectorAll(".filter-btn")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const pageNumbers = document.getElementById("pageNumbers")
const lightbox = document.getElementById("lightbox")
const lightboxImage = document.getElementById("lightboxImage")
const lightboxTitle = document.getElementById("lightboxTitle")
const lightboxCategory = document.getElementById("lightboxCategory")
const lightboxClose = document.getElementById("lightboxClose")
const lightboxPrev = document.getElementById("lightboxPrev")
const lightboxNext = document.getElementById("lightboxNext")
const nightModeToggle = document.getElementById("nightModeToggle")
const nightModeIcon = document.getElementById("nightModeIcon")

// Initialize gallery
function initGallery() {
  renderGallery()
  setupEventListeners()
}

// Render gallery items
function renderGallery() {
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const itemsToShow = filteredItems.slice(startIndex, endIndex)

  galleryGrid.innerHTML = ""

  itemsToShow.forEach((item, index) => {
    const galleryItem = createGalleryItem(item, startIndex + index)
    galleryGrid.appendChild(galleryItem)
  })

  updatePagination()
}

// Create gallery item element
function createGalleryItem(item, index) {
  const div = document.createElement("div")
  div.className = "gallery-item"
  div.innerHTML = `
        <img src="${item.src}" alt="${item.alt}" loading="lazy" crossorigin="anonymous">
        <div class="gallery-item-info">
            <h3 class="gallery-item-title">${item.alt}</h3>
            <p class="gallery-item-category">${item.category}</p>
        </div>
    `

  div.addEventListener("click", () => openLightbox(index))

  return div
}

// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  // Update navigation buttons
  prevBtn.disabled = currentPage === 0
  nextBtn.disabled = currentPage === totalPages - 1

  // Update page numbers
  pageNumbers.innerHTML = ""

  if (totalPages > 1) {
    for (let i = 0; i < totalPages; i++) {
      const pageBtn = document.createElement("button")
      pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`
      pageBtn.textContent = i + 1
      pageBtn.addEventListener("click", () => goToPage(i))
      pageNumbers.appendChild(pageBtn)
    }
  }

  // Show/hide pagination container
  const paginationContainer = document.getElementById("paginationContainer")
  paginationContainer.style.display = totalPages > 1 ? "flex" : "none"
}

// Go to specific page
function goToPage(page) {
  currentPage = page
  renderGallery()
  scrollToTop()
}

// Filter items
function filterItems(category) {
  currentFilter = category
  filteredItems = category === "all" ? [...galleryItems] : galleryItems.filter((item) => item.category === category)
  currentPage = 0
  renderGallery()
  scrollToTop()
}

// Open lightbox
function openLightbox(index) {
  const globalIndex = galleryItems.findIndex((item) => item.id === filteredItems[index % filteredItems.length].id)

  currentLightboxIndex = globalIndex
  const item = galleryItems[globalIndex]

  lightboxImage.src = item.src
  lightboxImage.alt = item.alt
  lightboxTitle.textContent = item.alt
  lightboxCategory.textContent = item.category

  lightbox.classList.add("active")
  document.body.style.overflow = "hidden"
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("active")
  document.body.style.overflow = ""
  currentLightboxIndex = null
}

// Navigate lightbox
function navigateLightbox(direction) {
  if (currentLightboxIndex === null) return

  const newIndex =
    direction === "prev"
      ? (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length
      : (currentLightboxIndex + 1) % galleryItems.length

  currentLightboxIndex = newIndex
  const item = galleryItems[newIndex]

  lightboxImage.src = item.src
  lightboxImage.alt = item.alt
  lightboxTitle.textContent = item.alt
  lightboxCategory.textContent = item.category
}

// Scroll to top smoothly
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active filter button
      filterButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filter items
      const filter = btn.getAttribute("data-filter")
      filterItems(filter)
    })
  })

  // Navigation buttons
  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1)
    }
  })

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1)
    }
  })

  // Lightbox controls
  lightboxClose.addEventListener("click", closeLightbox)
  lightboxPrev.addEventListener("click", () => navigateLightbox("prev"))
  lightboxNext.addEventListener("click", () => navigateLightbox("next"))

  // Close lightbox when clicking outside
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (currentLightboxIndex === null) return

    switch (e.key) {
      case "ArrowLeft":
        navigateLightbox("prev")
        break
      case "ArrowRight":
        navigateLightbox("next")
        break
      case "Escape":
        closeLightbox()
        break
    }
  })

  // Smooth scroll for better UX
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add loading animation for images
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "1"
    })

    img.addEventListener("error", function () {
      this.src = "/placeholder.svg?height=300&width=400"
    })
  })

  // Night mode toggle
  nightModeToggle.addEventListener("click", () => {
    const enabled = !document.documentElement.classList.contains("night-mode")
    setNightMode(enabled)
  })
}

// Set night mode
function setNightMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add("night-mode")
    nightModeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`
    localStorage.setItem("nightMode", "1")
  } else {
    document.documentElement.classList.remove("night-mode")
    nightModeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>`
    localStorage.setItem("nightMode", "0")
  }
}

// On load, set mode from localStorage
document.addEventListener("DOMContentLoaded", () => {
  initGallery()
  setupAnimations()
  setupLazyLoading()

  // Add a subtle parallax effect to floating shapes
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const shapes = document.querySelectorAll(".floating-shape")

    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.1
      shape.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  setNightMode(localStorage.getItem("nightMode") === "1")
})

// Add smooth transitions when page loads
window.addEventListener("load", () => {
  document.body.style.opacity = "1"
  document.body.style.transition = "opacity 0.5s ease-in-out"
})

// Setup animations (placeholder function)
function setupAnimations() {
  // Animation setup code would go here
}

// Setup lazy loading (placeholder function)
function setupLazyLoading() {
  // Lazy loading setup code would go here
}
