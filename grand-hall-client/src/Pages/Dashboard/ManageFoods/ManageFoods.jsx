import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';

// const imageUploadKey = import.meta.env.VITE_IMAGE_UPLOAD_KEY;

const ManageFoods = () => {

  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const { data: foods = [], refetch, isLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      const res = await axiosSecure.get('/menu');
      return res.data;
    }
  });

  // 🔥 IMAGE UPLOAD
  const uploadImage = async (imageFile) => {

    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await res.json();
    return data.data.display_url;
  };

  // ❌ DELETE FOOD
  const handleDeleteFood = async (id) => {

    if (!confirm('Delete this food?')) return;

    setLoading(true);

    await axiosSecure.delete(`/menu/${id}`);

    await refetch();

    setLoading(false);
  };

  // ✏️ OPEN MODAL
  const openEditModal = (food) => {

    setSelectedFood(food);

    setTimeout(() => {
      document.getElementById('edit_modal').showModal();
    }, 0);
  };

  // ❌ CLOSE MODAL
  const closeModal = () => {
    document.getElementById('edit_modal').close();
  };

  // ✅ UPDATE FOOD
  const handleEditFood = async (e) => {

    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const name = form.name.value;
    const basePrice = Number(form.baseprice.value);
    const discountPrice = Number(form.discountprice.value);
    const status = form.status.value === 'true';
    const imageFile = form.image.files[0];

    // let imageUrl = selectedFood.media.thumbnail;
    let imageUrl = selectedFood?.media?.thumbnail || "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const updatedFood = {
      name,
      pricing: {
        basePrice,
        discountPrice
      },
      availability: {
        isAvailable: status
      },
      media: {
        thumbnail: imageUrl
      }
    };

    await axiosSecure.patch(`/menu/${selectedFood._id}`, updatedFood);

    await refetch();

    setLoading(false);

    closeModal();
  };

  if (isLoading) {
    return <p className="text-center mt-20">Loading foods...</p>;
  }

 return (

  <div className='w-full md:w-11/12 mx-auto px-3 md:px-0 py-8 md:py-14'>

    <h2 className='text-2xl md:text-3xl font-bold my-6 md:my-8'>
      Manage Foods: {foods.length}
    </h2>

    {loading && (
      <p className='text-sm text-gray-500 mb-3'>
        Processing...
      </p>
    )}

    <div className='overflow-x-auto rounded-lg border'>

      <table className='table table-sm md:table-md w-full'>

        <thead>
          <tr className="text-xs md:text-sm">
            <th>No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Base Price</th>
            <th className="hidden md:table-cell">Discount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {foods.map((food, i) => (

            <tr key={food._id} className="text-xs md:text-sm">

              <td>{i + 1}</td>

              {/* IMAGE */}
              <td>
                <img
                  src={food.media.thumbnail}
                  className='w-12 h-12 md:w-16 md:h-16 rounded object-cover'
                />
              </td>

              {/* NAME */}
              <td className='max-w-[120px] md:max-w-none truncate font-medium'>
                {food.name}
              </td>

              {/* BASE PRICE */}
              <td className='whitespace-nowrap'>
                ৳ {food.pricing.basePrice}
              </td>

              {/* DISCOUNT PRICE (hidden mobile) */}
              <td className='whitespace-nowrap hidden md:table-cell'>
                ৳ {food.pricing.discountPrice}
              </td>

              {/* STATUS */}
              <td>
                {food.availability.isAvailable ? (
                  <span className='text-xs md:text-sm bg-green-600 text-white px-2 py-1 rounded'>
                    Available
                  </span>
                ) : (
                  <span className='text-xs md:text-sm bg-red-500 text-white px-2 py-1 rounded'>
                    Unavailable
                  </span>
                )}
              </td>

              {/* ACTION */}
              <td className='flex flex-col md:flex-row gap-2'>

                <button
                  onClick={() => openEditModal(food)}
                  className='btn btn-xs md:btn-sm btn-info'
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteFood(food._id)}
                  className='btn btn-xs md:btn-sm btn-error'
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* ✏️ EDIT MODAL */}

    <dialog id='edit_modal' className='modal'>

      <div className='modal-box w-full max-w-md'>

        <h3 className='font-bold text-lg mb-4'>
          Edit Food
        </h3>

        <form onSubmit={handleEditFood} className='space-y-3'>

          <input
            name='name'
            defaultValue={selectedFood?.name}
            className='input input-bordered w-full'
          />

          <input
            name='baseprice'
            type='number'
            defaultValue={selectedFood?.pricing?.basePrice}
            className='input input-bordered w-full'
          />

          <input
            name='discountprice'
            type='number'
            defaultValue={selectedFood?.pricing?.discountPrice}
            className='input input-bordered w-full'
          />

          <input
            type='file'
            name='image'
            accept='image/*'
            className='file-input file-input-bordered w-full'
          />

          <select
            name='status'
            defaultValue={selectedFood?.availability?.isAvailable?.toString()}
            className='select select-bordered w-full'
          >
            <option value='true'>Available</option>
            <option value='false'>Unavailable</option>
          </select>

          <div className='flex flex-col md:flex-row gap-3'>

            <button className='btn btn-primary flex-1'>
              Update Food
            </button>

            <button
              type="button"
              onClick={closeModal}
              className='btn btn-outline flex-1'
            >
              Close
            </button>

          </div>

        </form>

      </div>

    </dialog>

  </div>

);

};

export default ManageFoods;