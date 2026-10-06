function MessGallery({ mess }) {
  const images = mess.images || [];

  if (images.length === 0) {
    return (
      <div className="gallery-placeholder">
        <div>
          <span>📷</span>
          <h3>Mess Photos</h3>
          <p>Photos will be uploaded later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mess-gallery">
      {images.map((image, index) => (
        <img
          key={index}
          src={`${import.meta.env.BASE_URL}${image}`}
          alt={`${mess.name} ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default MessGallery;
