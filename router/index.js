import account from "./account";
import entry from "./entry";
import labels from "./labels";
import org from "./org";
import perm from "./perm";
import uc from "./uc";

export default (app) => [
  ...account(app),
  ...entry(app),
  ...uc(app),
  ...labels,
  ...org,
  ...perm,
];
