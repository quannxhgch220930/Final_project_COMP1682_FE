import { useEffect, useMemo, useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { addressApi } from '../api/address.api'

function createInitialFormValues() {
  return {
    district: '',
    province: '',
    receiverName: '',
    receiverPhone: '',
    street: '',
    ward: '',
  }
}

function validateAddress(values) {
  const errors = {}

  if (!values.receiverName.trim()) {
    errors.receiverName = 'Receiver name is required'
  }

  if (!values.receiverPhone.trim()) {
    errors.receiverPhone = 'Receiver phone is required'
  } else if (!/^[0-9]{10,11}$/.test(values.receiverPhone.trim())) {
    errors.receiverPhone = 'Receiver phone must contain 10 to 11 digits'
  }

  if (!values.province.trim()) {
    errors.province = 'Province is required'
  }

  if (!values.district.trim()) {
    errors.district = 'District is required'
  }

  if (!values.ward.trim()) {
    errors.ward = 'Ward is required'
  }

  if (!values.street.trim()) {
    errors.street = 'Street is required'
  }

  return errors
}

function AddressBook() {
  const [actionAddressId, setActionAddressId] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(createInitialFormValues)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [status, setStatus] = useState('')

  const formTitle = useMemo(
    () => (selectedAddress ? 'Edit address' : 'Add address'),
    [selectedAddress],
  )

  useEffect(() => {
    let mounted = true

    addressApi
      .getList()
      .then((response) => {
        if (!mounted) {
          return
        }

        setAddresses(response.items)
        setErrorMessage('')
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setErrorMessage(handleApiError(error))
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const resetForm = () => {
    setFormErrors({})
    setFormValues(createInitialFormValues())
    setIsFormOpen(false)
    setSelectedAddress(null)
  }

  const handleChange = (field) => (event) => {
    setFormValues((current) => ({
      ...current,
      [field]: event.target.value,
    }))

    setFormErrors((current) => ({
      ...current,
      [field]: '',
    }))
  }

  const openCreateForm = () => {
    setStatus('')
    setErrorMessage('')
    setFormErrors({})
    setFormValues(createInitialFormValues())
    setIsFormOpen(true)
    setSelectedAddress(null)
  }

  const openEditForm = (address) => {
    setStatus('')
    setErrorMessage('')
    setFormErrors({})
    setFormValues({
      district: address.district,
      province: address.province,
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      street: address.street,
      ward: address.ward,
    })
    setIsFormOpen(true)
    setSelectedAddress(address)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateAddress(formValues)

    setFormErrors(nextErrors)
    setErrorMessage('')
    setStatus('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      if (selectedAddress) {
        const response = await addressApi.update(selectedAddress.id, formValues)

        setAddresses((current) =>
          current.map((address) =>
            address.id === response.data.id ? response.data : address,
          ),
        )
        setStatus(response.message)
      } else {
        const response = await addressApi.create(formValues)

        setAddresses((current) => [response.data, ...current])
        setStatus(response.message)
      }

      resetForm()
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (address) => {
    const confirmed = window.confirm(`Delete address for ${address.receiverName}?`)

    if (!confirmed) {
      return
    }

    setActionAddressId(address.id)
    setErrorMessage('')
    setStatus('')

    try {
      const response = await addressApi.delete(address.id)

      setAddresses((current) =>
        current.filter((currentAddress) => currentAddress.id !== address.id),
      )

      if (selectedAddress?.id === address.id) {
        resetForm()
      }

      setStatus(response.message)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setActionAddressId(null)
    }
  }

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Address book
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
            Saved delivery addresses
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            Manage your delivery addresses without relying on a default address.
          </p>
        </div>

        <Button type="button" onClick={openCreateForm}>
          Add address
        </Button>
      </div>

      {isFormOpen ? (
        <form
          className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              {formTitle}
            </p>
            <h4 className="text-xl font-semibold text-stone-900">
              {selectedAddress ? selectedAddress.receiverName : 'New address'}
            </h4>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="address-receiver-name">
                Receiver name
              </label>
              <Input
                id="address-receiver-name"
                value={formValues.receiverName}
                onChange={handleChange('receiverName')}
                placeholder="Nguyen Van A"
              />
              {formErrors.receiverName ? (
                <p className="text-sm text-rose-600">{formErrors.receiverName}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="address-receiver-phone">
                Receiver phone
              </label>
              <Input
                id="address-receiver-phone"
                value={formValues.receiverPhone}
                onChange={handleChange('receiverPhone')}
                placeholder="0912345678"
              />
              {formErrors.receiverPhone ? (
                <p className="text-sm text-rose-600">{formErrors.receiverPhone}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="address-province">
                Province
              </label>
              <Input
                id="address-province"
                value={formValues.province}
                onChange={handleChange('province')}
                placeholder="Ho Chi Minh City"
              />
              {formErrors.province ? (
                <p className="text-sm text-rose-600">{formErrors.province}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="address-district">
                District
              </label>
              <Input
                id="address-district"
                value={formValues.district}
                onChange={handleChange('district')}
                placeholder="District 1"
              />
              {formErrors.district ? (
                <p className="text-sm text-rose-600">{formErrors.district}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="address-ward">
                Ward
              </label>
              <Input
                id="address-ward"
                value={formValues.ward}
                onChange={handleChange('ward')}
                placeholder="Ben Nghe"
              />
              {formErrors.ward ? (
                <p className="text-sm text-rose-600">{formErrors.ward}</p>
              ) : null}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="address-street">
                Street
              </label>
              <Input
                id="address-street"
                value={formValues.street}
                onChange={handleChange('street')}
                placeholder="123 Nguyen Hue"
              />
              {formErrors.street ? (
                <p className="text-sm text-rose-600">{formErrors.street}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : selectedAddress
                  ? 'Update address'
                  : 'Save address'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {status ? (
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          {status}
        </span>
      ) : null}
      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
      {isLoading ? <p className="text-sm text-stone-500">Loading addresses...</p> : null}

      <div className="grid gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => {
            const isBusy = actionAddressId === address.id

            return (
              <article
                key={address.id}
                className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
              >
                <div className="grid gap-2">
                  <h4 className="text-lg font-semibold text-stone-900">
                    {address.receiverName}
                  </h4>
                  <p className="text-sm text-stone-600">{address.receiverPhone}</p>
                  <p className="text-sm text-stone-700">
                    {address.fullAddress ||
                      [address.street, address.ward, address.district, address.province]
                        .filter(Boolean)
                        .join(', ')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isBusy}
                    onClick={() => openEditForm(address)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(address)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/65 p-5 text-sm text-stone-600">
            No saved addresses yet.
          </div>
        )}
      </div>
    </section>
  )
}

export default AddressBook
