import account from "./account";
import entry from "./entry";
import labels from "./labels";
import org from "./org";
import perm from "./perm";
import uc from "./uc";

export default (app, mdl, store) => [
  ...account(app, mdl, store),
  ...entry(app, mdl, store),
  ...uc(app, mdl, store),
  ...labels,
  ...org,
  ...perm,
];
