import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, deleteCategory } from '../../redux/features/categorySlice';
import { toast } from 'react-toastify';
import QuestionBox from '../../components/QuestionBox/QuestionBox';

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [newCatName, setNewCatName] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCatName.trim() === '') {
      toast.error('Kategori adı boş bırakılamaz.');
      return;
    }
    dispatch(addCategory({ name: newCatName })).then(() => {
      toast.success('Kategori başarıyla eklendi!');
      setNewCatName('');
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteCategory(deleteId)).then(() => {
        toast.info('Kategori başarıyla silindi.');
        setDeleteId(null);
      });
    }
  };

  return (
    <div className="page-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Kategori Yönetimi</h2>
          <p className="text-secondary small mb-0">Ürünlerinizi sınıflandırmak için kategoriler oluşturun</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left side add form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3">Yeni Kategori</h5>
            <form onSubmit={handleAddCategory}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Kategori Adı</label>
                <input 
                  type="text" 
                  className="form-control rounded-3" 
                  placeholder="Örn: Pizzalar, İçecekler" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold text-white shadow-sm">
                Ekle
              </button>
            </form>
          </div>
        </div>

        {/* Right side list */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-folder-x fs-1 text-orange d-block mb-2"></i>
                <p className="text-secondary mt-2 small">Eklenmiş kategori bulunmuyor.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover mt-2">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Kategori Adı</th>
                      <th scope="col" className="text-end">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="fw-bold">{cat.name}</td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-3 border-0"
                            onClick={() => setDeleteId(cat.id)}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom confirm replace alert */}
      <QuestionBox 
        isOpen={deleteId !== null}
        title="Kategoriyi Sil"
        message="Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait ürünler silinmeyecektir ancak kategorisiz kalabilir."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
