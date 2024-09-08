import {Link} from '~/components';

export function AccountDetails({customer}) {
  const {firstName, lastName, emailAddress, phoneNumber} = customer;

  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead">Account Details</h3>
        <div className="lg:p-8 p-6 border border-gray-200 rounded">
          <div className="mt-4 text-sm text-primary/50">Name</div>
          <p className="mt-1">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') + lastName
              : ''}{' '}
          </p>

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          <p className="mt-1">{phoneNumber.phoneNumber ?? 'No number'}</p>

          <div className="mt-4 text-sm text-primary/50">Email address</div>
          <p className="mt-1">{emailAddress.emailAddress}</p>
        </div>
      </div>
    </>
  );
}
